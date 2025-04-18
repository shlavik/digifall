import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { loadOrCreateSelfKey } from "@libp2p/config";
import { identify } from "@libp2p/identify";
import { keychain } from "@libp2p/keychain";
import { plaintext } from "@libp2p/plaintext";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { webSockets } from "@libp2p/websockets";
import { multiaddr } from "@multiformats/multiaddr";
import { IDBDatastore } from "datastore-idb";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { get } from "svelte/store";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

import {
  ALLOW_ALL_RELAYS,
  DEBUG,
  INITIAL_VALUES,
  KEYS,
  MAX_RECORDS,
  PHASES,
  RECORD_TYPES,
} from "./constants.js";
import { getSeed, squashIntegers } from "./core.js";
import { createIndexedDBStore } from "./persistence.js";
import { options, phase, records } from "./stores.js";
import { UniQueue } from "./uniqueue.js";
import { validateRecord } from "./validation.js";

const PROTOCOLS = {
  root: "/digifall/root/1.0",
  preview: "/digifall/preview/1.0",
};
const RELAY_PEER_ID_1 = "12D3KooWPtwHvQJPynCEtb4ZXN9fCTEABJnrSdX6aq3nczNwdUTw";
const RELAY_PEER_ID_2 = "12D3KooWLfyJ73CXB57rFZuSuL1AVyVZxrwGmbzRNq8jDPJzfFRa";
const ALL_RELAY_PEER_IDS = [RELAY_PEER_ID_1, RELAY_PEER_ID_2];
const RELAY_MULTIADDR_1 =
  "/dns4/r1.digifall.app/tcp/443/wss/p2p/" + RELAY_PEER_ID_1;
const RELAY_MULTIADDR_2 =
  "/dns4/r2.digifall.app/tcp/443/wss/p2p/" + RELAY_PEER_ID_2;
const ALL_RELAY_MULTIADDRS = [RELAY_MULTIADDR_1, RELAY_MULTIADDR_2];

let currentRelayIndex = -1;

/** @type {import('@libp2p/interface').Libp2p} */
let libp2p;
const blacklist = new Set();

export const indexedDBStore = createIndexedDBStore(
  KEYS.digifall,
  KEYS.leaderboard,
);

export const leaderboardStores = RECORD_TYPES.reduce((result, type) => {
  result[type] = indexedDBStore(type, INITIAL_VALUES[KEYS.leaderboard][type]);
  return result;
}, {});

export function compare(a, b) {
  if (a.value > b.value) return 1;
  if (a.value < b.value) return -1;
  if (a.timestamp < b.timestamp) return -1;
  if (a.timestamp > b.timestamp) return 1;
  return 0;
}

function extractKey({ playerName }) {
  return playerName;
}

const queues = RECORD_TYPES.reduce((result, type) => {
  result[type] = new UniQueue({ maxSize: MAX_RECORDS, compare, extractKey });
  return result;
}, {});

const roots = RECORD_TYPES.reduce((result, type) => {
  result[type] = 0;
  return result;
}, {});

function parseMessage(message) {
  return JSON.parse(uint8ArrayToString(message.subarray()));
}

function toMessage(object) {
  return uint8ArrayFromString(JSON.stringify(object));
}

async function validateSource(source) {
  for await (const message of source) {
    const game = parseMessage(message);
    const { type, playerName, value } = game;
    if (!queues[type]) continue;
    const { data, indexes } = queues[type];
    const index = indexes.get(playerName);
    if (index in data && data[index].value >= value) continue;
    validateRecord(game)
      .then((game) => {
        queues[type].push(game);
        leaderboardStores[type].set(queues[type].data);
        console.warn("P2P LEADERBOARD UPDATED!", type, playerName, value);
      })
      .catch((error) => DEBUG && console.error(...error));
  }
}

async function handlePreview({ stream }) {
  if (DEBUG) console.log("handlePreview");
  pipe(
    stream.source,
    async function* (source) {
      const touchedTypes = new Set();
      const skippedNames = RECORD_TYPES.reduce((result, type) => {
        result[type] = new Set();
        return result;
      }, {});
      for await (const message of source) {
        const { type, playerName, value } = parseMessage(message);
        if (type in queues) touchedTypes.add(type);
        else continue;
        const index = queues[type].indexes.get(playerName);
        if (index === undefined) continue;
        if (queues[type].data[index].value > value) continue;
        skippedNames[type].add(playerName);
      }
      const messages = Array.from(touchedTypes).flatMap((type) =>
        queues[type].data
          .filter((game) => !skippedNames[type].has(game.playerName))
          .map(toMessage),
      );
      for (const message of messages) {
        yield message;
      }
    },
    stream.sink,
  ).catch((error) => DEBUG && console.error(error));
}

async function pushPreview(connection, types) {
  if (DEBUG) console.log(PROTOCOLS.preview);
  const messages = types.flatMap((type) =>
    queues[type].data.map(({ playerName, value }) =>
      toMessage({ type, playerName, value }),
    ),
  );
  return connection
    .newStream(PROTOCOLS.preview, { runOnLimitedConnection: true })
    .then((previewStream) => pipe(messages, previewStream, validateSource))
    .catch((error) => DEBUG && console.error(error));
}

async function handleRoot({ connection, stream }) {
  if (DEBUG) console.log("handleRoot");
  pipe(
    stream.source,
    async function* (source) {
      const previewTypes = new Set();
      for await (const message of source) {
        const [type, remoteRoot] = parseMessage(message);
        if (!(type in roots)) continue;
        if (remoteRoot === 0) {
          for (const game of queues[type].data) {
            yield toMessage(game);
          }
          continue;
        }
        if (type in roots && remoteRoot !== roots[type]) {
          previewTypes.add(type);
        }
      }
      if (previewTypes.size === 0 || connection.status !== "open") return;
      pushPreview(connection, Array.from(previewTypes));
    },
    stream.sink,
  ).catch((error) => DEBUG && console.error(error));
}

async function pushRoot(connection) {
  if (DEBUG) console.log(PROTOCOLS.root);
  const messages = Object.entries(roots).map(toMessage);
  return connection
    .newStream(PROTOCOLS.root, { runOnLimitedConnection: true })
    .then((rootStream) => pipe(messages, rootStream, validateSource))
    .catch((error) => {
      if (DEBUG) console.error(error);
      if (error.name === "UnsupportedProtocolError") {
        blacklist.add(connection.remotePeer.toString());
      }
      connection.close();
    });
}

async function handleConnectionOpen({ detail: connection }) {
  const remotePeerId = connection.remotePeer.toString();
  if (DEBUG) console.log("connection:open", remotePeerId);
  if (ALL_RELAY_PEER_IDS.includes(remotePeerId)) return;
  if (connection.status !== "open") return;
  await pushRoot(connection);
}

async function handlePubsubMessage({ detail: { from: peerId } }) {
  if (DEBUG) {
    console.log(
      "pubsub:message",
      peerId.toString(),
      peerId === libp2p.peerId ? "local" : "remote",
    );
  }
  libp2p.dial(peerId).catch(() => {});
}

function getCurrentRelayPeerId() {
  if (currentRelayIndex === -1) {
    return ALL_RELAY_PEER_IDS[
      (currentRelayIndex = Math.floor(
        Math.random() * ALL_RELAY_PEER_IDS.length,
      ))
    ];
  }
  return ALL_RELAY_PEER_IDS[currentRelayIndex];
}

async function restoreRelay() {
  if (libp2p.getConnections().length > 0) return;
  if (DEBUG) console.log("restoreRelay");
  getCurrentRelayPeerId(); // Initialize current relay index
  return libp2p
    .dial(
      multiaddr(
        ALL_RELAY_MULTIADDRS[
          (currentRelayIndex =
            (currentRelayIndex + 1) % ALL_RELAY_PEER_IDS.length) // Next relay
        ],
      ),
    )
    .catch((ee) => {
      console.error("Failed to restore relay", ee);
    });
}

(async function initP2PLeaderboard() {
  const store = new IDBDatastore("keystore");
  await store.open();
  const privateKey = await loadOrCreateSelfKey(store);
  libp2p = await createLibp2p({
    privateKey,
    addresses: {
      listen: ["/p2p-circuit"],
    },
    transports: [webSockets(), circuitRelayTransport()],
    connectionEncrypters: [plaintext()],
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: ALL_RELAY_MULTIADDRS,
      }),
      pubsubPeerDiscovery({
        interval: 13e3,
        topics: ["digifall._peer-discovery"],
        listenOnly: false,
      }),
    ],
    connectionGater: {
      denyDialPeer(remotePeer) {
        const remotePeerId = remotePeer.toString();
        if (blacklist.has(remotePeerId)) return true;
        if (libp2p.getConnections().length >= 3) return true;
        if (ALLOW_ALL_RELAYS) return false;
        if (ALL_RELAY_PEER_IDS.includes(remotePeerId)) {
          return remotePeerId !== getCurrentRelayPeerId();
        }
        return false;
      },
      denyInboundConnection() {
        return libp2p.getConnections().length >= 5;
      },
    },
    services: {
      identify: identify({ protocolPrefix: "digifall" }),
      pubsub: gossipsub({ emitSelf: true }),
      keychain: keychain(),
    },
  });
  setInterval(() => restoreRelay().catch(() => {}), 73e3);
  libp2p.services.pubsub.addEventListener("message", handlePubsubMessage);
  libp2p.addEventListener("connection:open", handleConnectionOpen);
  libp2p.handle(PROTOCOLS.root, handleRoot, {
    runOnLimitedConnection: true,
  });
  libp2p.handle(PROTOCOLS.preview, handlePreview, {
    runOnLimitedConnection: true,
  });
  if (DEBUG) window.libp2p = libp2p;
})();

async function forceSync() {
  libp2p
    .getConnections()
    .filter(({ remotePeer, status }) => {
      return (
        status === "open" && !ALL_RELAY_PEER_IDS.includes(remotePeer.toString())
      );
    })
    .forEach(pushRoot);
}

RECORD_TYPES.forEach((type) => {
  const leaderboardStore = leaderboardStores[type];
  leaderboardStore.subscribe(async ($leaderboard) => {
    if (!$leaderboard || $leaderboard.length === 0) return;
    if (queues[type].data.length > 0) {
      const rootPrev = roots[type];
      roots[type] = squashIntegers(
        $leaderboard
          .slice()
          .sort(compare)
          .map((game) => squashIntegers([getSeed(game), game.value])),
      );
      return rootPrev !== roots[type] && libp2p && forceSync();
    }
    Promise.allSettled(
      $leaderboard.map((record) =>
        validateRecord(record).then((game) => queues[type].push(game)),
      ),
    ).then(() => leaderboardStore.set(queues[type].data));
  });
});

records.subscribe(($records) => {
  const $phase = get(phase);
  if ($phase !== PHASES.idle && $phase !== PHASES.gameOver) return;
  RECORD_TYPES.forEach((type) => {
    const record = $records[type];
    if (record[KEYS.value] === 0) return;
    record[KEYS.type] = type;
    queues[type].push(record);
    leaderboardStores[type].set(queues[type].data);
  });
});

options.subscribe(({ leaderboard }) => {
  setTimeout(() => (leaderboard ? libp2p.start() : libp2p.stop()), 3e3);
});
