import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { bootstrap } from "@libp2p/bootstrap";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { dcutr } from "@libp2p/dcutr";
import { identify } from "@libp2p/identify";
import { mplex } from "@libp2p/mplex";
import { createEd25519PeerId, createFromJSON } from "@libp2p/peer-id-factory";
import { plaintext } from "@libp2p/plaintext";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { webSockets } from "@libp2p/websockets";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { get } from "svelte/store";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

import { INITIAL_VALUES, KEYS, PHASES, RECORD_TYPES } from "./constants.js";
import { getSeed, squashIntegers } from "./core.js";
import { createIndexedDBStore, localStorageStore } from "./persistence.js";
import { options, phase, records } from "./stores.js";
import { UniQueue } from "./uniqueue.js";
import { validateRecord } from "./validation.js";

const PROTOCOLS = {
  root: "/digifall/root/1.0",
  preview: "/digifall/preview/1.0",
};
const RELAY_PEER_ID = "12D3KooWRjPoVe5DnnMJzy8PYUwmgrkvgaXSpuR3MuNmbgoSRvio";
const RELAY_MULTIADDR =
  "/dns4/relay.digifall.app/tcp/443/wss/p2p/" + RELAY_PEER_ID;
const DEBUG = Boolean(localStorage.getItem("debug"));

let libp2p;

export const indexedDBStore = createIndexedDBStore(
  KEYS.digifall,
  KEYS.leaderboard
);

export const leaderboardStores = RECORD_TYPES.reduce((result, type) => {
  result[type] = indexedDBStore(type, INITIAL_VALUES[KEYS.leaderboard][type]);
  return result;
}, {});

export const maxSize = 81;

export function compare(a, b) {
  if (a.value > b.value) return 1;
  if (a.value < b.value) return -1;
  if (a.timestamp === b.timestamp) return 0;
  return a.timestamp < b.timestamp ? 1 : -1;
}

function extractKey({ playerName }) {
  return playerName;
}

const queues = RECORD_TYPES.reduce((result, type) => {
  result[type] = new UniQueue({ maxSize, compare, extractKey });
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

async function pushPreview(connection, types) {
  if (DEBUG) console.log(PROTOCOLS.preview);
  const messages = types.flatMap((type) =>
    queues[type].data.map(({ playerName, value }) =>
      toMessage({ type, playerName, value })
    )
  );
  return connection
    .newStream(PROTOCOLS.preview, { runOnTransientConnection: true })
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
    stream.sink
  ).catch((error) => DEBUG && console.error(error));
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
        if (type in roots) touchedTypes.add(type);
        const index = queues[type].indexes.get(playerName);
        if (index === undefined) continue;
        if (queues[type].data[index].value > value) continue;
        skippedNames[type].add(playerName);
      }
      const messages = Array.from(touchedTypes).flatMap((type) =>
        queues[type].data
          .filter((game) => !skippedNames[type].has(game.playerName))
          .map(toMessage)
      );
      for (const message of messages) {
        yield message;
      }
    },
    stream.sink
  ).catch((error) => DEBUG && console.error(error));
}

function handlePeerDiscovery({ detail: remotePeer }) {
  if (DEBUG) console.log("peer:discovery", remotePeer.id.toString());
}

async function pushRoot(connection) {
  if (DEBUG) console.log(PROTOCOLS.root);
  const messages = Object.entries(roots).map(toMessage);
  return connection
    .newStream(PROTOCOLS.root, { runOnTransientConnection: true })
    .then((rootStream) => pipe(messages, rootStream, validateSource))
    .catch((error) => {
      if (DEBUG) console.error(error);
      if (error.message !== "protocol selection failed") return;
      libp2p.components.connectionGater.denyDialPeer(connection.remotePeer);
    });
}

function handleConnectionOpen({ detail: connection }) {
  const remotePeerId = connection.remotePeer.toString();
  if (DEBUG) console.log("connection:open", remotePeerId);
  if (remotePeerId === RELAY_PEER_ID) return;
  if (connection.status !== "open") return;
  pushRoot(connection);
}

(async function initP2PLeaderboard() {
  const initialPeerId = await createEd25519PeerId();
  const peerId = await createFromJSON(
    get(
      localStorageStore(KEYS.peerId, {
        id: initialPeerId.toString(),
        privKey: uint8ArrayToString(initialPeerId.privateKey, "base64pad"),
        pubKey: uint8ArrayToString(initialPeerId.publicKey, "base64pad"),
      })
    )
  );
  libp2p = await createLibp2p({
    peerId,
    transports: [webSockets(), circuitRelayTransport({ discoverRelays: 1 })],
    connectionEncryption: [plaintext()],
    streamMuxers: [mplex()],
    peerDiscovery: [
      bootstrap({
        list: [RELAY_MULTIADDR],
      }),
      pubsubPeerDiscovery({
        interval: 10e3,
        topics: ["digifall._peer-discovery"],
        listenOnly: false,
      }),
    ],
    services: {
      identify: identify(),
      dcutr: dcutr(),
      pubsub: gossipsub({ emitSelf: true }),
    },
    connectionManager: {
      minConnections: 2,
      maxConnections: DEBUG ? 5 : 3,
    },
  });
  libp2p.handle(PROTOCOLS.root, handleRoot, {
    runOnTransientConnection: true,
  });
  libp2p.handle(PROTOCOLS.preview, handlePreview, {
    runOnTransientConnection: true,
  });
  libp2p.addEventListener("peer:discovery", handlePeerDiscovery);
  libp2p.addEventListener("connection:open", handleConnectionOpen);
  if (DEBUG) window.libp2p = libp2p;
})();

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
          .map((game) => squashIntegers([getSeed(game), game.value]))
      );
      if (rootPrev === roots[type]) return;
      return libp2p
        .getConnections()
        .filter(
          ({ direction, remotePeer, status }) =>
            direction === "outbound" &&
            remotePeer.toString() !== RELAY_PEER_ID &&
            status === "open"
        )
        .forEach(pushRoot);
    }
    Promise.allSettled(
      $leaderboard.map((record) =>
        validateRecord(record).then((game) => queues[type].push(game))
      )
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
  setTimeout(() => (leaderboard ? libp2p.start() : libp2p.stop()), 3333);
});
