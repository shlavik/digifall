import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { mplex } from "@libp2p/mplex";
import { createEd25519PeerId, createFromJSON } from "@libp2p/peer-id-factory";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { circuitRelayTransport } from "libp2p/circuit-relay";
import { identifyService } from "libp2p/identify";
import { plaintext } from "libp2p/insecure";
import { get } from "svelte/store";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

import { INITIAL_VALUES, KEYS, PHASES, RECORD_TYPES } from "./constants.js";
import { getSeed, squashIntegers } from "./core.js";
import { createIndexedDBStore, localStorageStore } from "./persistence.js";
import { options, phase, records } from "./stores.js";
import { UniQueue } from "./uniqueue.js";
import { validateRecord } from "./validation.js";

const PROTOCOL_PREFIX = "/digifall";
const PROTOCOLS = {
  root: PROTOCOL_PREFIX + "/root",
  preview: PROTOCOL_PREFIX + "/preview",
};
const RELAY_PEER_ID = "12D3KooWRjPoVe5DnnMJzy8PYUwmgrkvgaXSpuR3MuNmbgoSRvio";
const RELAY_MULTIADDR =
  "/dns4/relay.digifall.app/tcp/8443/wss/p2p/" + RELAY_PEER_ID;

const debug = Boolean(localStorage.getItem("debug"));
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

const rootHashes = RECORD_TYPES.reduce((result, type) => {
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
    const remoteUnique = parseMessage(message);
    const { type, playerName, value } = remoteUnique;
    const { data, indexes } = queues[type];
    const index = indexes.get(playerName);
    if (index in data && data[index].value >= value) continue;
    validateRecord(remoteUnique)
      .then((gameData) => {
        queues[type].push(gameData);
        leaderboardStores[type].set(queues[type].data);
        console.warn("P2P LEADERBOARD UPDATED!", type, playerName, value);
      })
      .catch((error) => debug && console.error(...error));
  }
}

async function handleRoot({ connection, stream }) {
  if (debug) console.log("handleRoot");
  pipe(
    stream.source,
    async (source) => {
      const remoteRootHashes = parseMessage((await source.next()).value);
      const rootTypes = RECORD_TYPES.filter(
        (type) => remoteRootHashes[type] !== rootHashes[type]
      );
      const previewTypes = rootTypes.filter(
        (type) => remoteRootHashes[type] > 0
      );
      if (previewTypes.length > 0 && connection.stat.status === "OPEN") {
        if (debug) console.log(PROTOCOLS.preview);
        const previewStream = await connection
          .newStream(PROTOCOLS.preview)
          .catch(() => null);
        if (previewStream) {
          pipe(
            previewTypes.flatMap((type) =>
              queues[type].data.map(({ playerName, value }) =>
                toMessage({ type, playerName, value })
              )
            ),
            previewStream,
            validateSource
          ).catch((error) => debug && console.error(error));
        }
      }
      return rootTypes
        .filter((type) => remoteRootHashes[type] === 0)
        .flatMap((type) =>
          queues[type].data.map((gameData) => toMessage(gameData))
        );
    },
    stream.sink
  ).catch((error) => debug && console.error(error));
}

async function handlePreview({ stream }) {
  if (debug) console.log("handlePreview");
  pipe(
    stream.source,
    async (source) => {
      const touchedTypes = new Set();
      const remoteActualNames = RECORD_TYPES.reduce((result, type) => {
        result[type] = new Set();
        return result;
      }, {});
      for await (const message of source) {
        const { type, playerName, value } = parseMessage(message);
        touchedTypes.add(type);
        const index = queues[type].indexes.get(playerName);
        if (index === undefined) continue;
        if (queues[type].data[index].value > value) continue;
        remoteActualNames[type].add(playerName);
      }
      return Array.from(touchedTypes).flatMap((type) =>
        queues[type].data
          .filter(
            (gameData) => !remoteActualNames[type].has(gameData.playerName)
          )
          .map((gameData) => toMessage(gameData))
      );
    },
    stream.sink
  ).catch((error) => debug && console.error(error));
}

function handlePeerDiscovery({ detail: remotePeer }) {
  if (debug) console.log("peer:discovery", remotePeer.id.toString());
}

async function handleConnectionOpen({ detail: connection }) {
  const remotePeerId = connection.remotePeer.toString();
  if (debug) console.log("connection:open", remotePeerId);
  if (remotePeerId === RELAY_PEER_ID) return;
  if (connection.stat.status !== "OPEN") return;
  if (debug) console.log(PROTOCOLS.root);
  const rootStream = await connection
    .newStream(PROTOCOLS.root)
    .catch(() => null);
  if (!rootStream) return;
  pipe([toMessage(rootHashes)], rootStream, validateSource).catch((error) => {
    if (debug) console.error(error);
    if (error.message !== "protocol selection failed") return;
    libp2p.components.connectionGater.denyDialPeer(connection.remotePeer);
  });
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
    transports: [
      webSockets({ filter: filters.all }),
      circuitRelayTransport({ discoverRelays: 1 }),
    ],
    connectionEncryption: [plaintext()],
    streamMuxers: [yamux(), mplex()],
    peerDiscovery: [
      bootstrap({
        list: [RELAY_MULTIADDR],
      }),
      pubsubPeerDiscovery({
        interval: 10e3,
        topics: [`digifall._peer-discovery._p2p._pubsub`],
      }),
    ],
    services: {
      identify: identifyService(),
      pubsub: gossipsub({ emitSelf: true }),
    },
    connectionManager: {
      minConnections: 2,
      maxConnections: debug ? 5 : 3,
    },
  });
  libp2p.handle(PROTOCOLS.root, handleRoot);
  libp2p.handle(PROTOCOLS.preview, handlePreview);
  libp2p.addEventListener("peer:discovery", handlePeerDiscovery);
  libp2p.addEventListener("connection:open", handleConnectionOpen);
  if (debug) window.libp2p = libp2p;
})();

RECORD_TYPES.forEach((type) => {
  const leaderboardStore = leaderboardStores[type];
  leaderboardStore.subscribe(async ($leaderboard) => {
    if (!$leaderboard || $leaderboard.length === 0) return;
    if (queues[type].data.length > 0) {
      const rootHashPrev = rootHashes[type];
      rootHashes[type] = squashIntegers(
        $leaderboard
          .slice()
          .sort(compare)
          .map((gameData) =>
            squashIntegers([getSeed(gameData), gameData.value])
          )
      );
      if (rootHashPrev === rootHashes[type]) return;
      return libp2p
        .getConnections()
        .filter(
          ({ remotePeer, stat }) =>
            remotePeer.toString() !== RELAY_PEER_ID && stat.status === "OPEN"
        )
        .forEach(async (connection) => {
          const rootStream = await connection
            .newStream(PROTOCOLS.root)
            .catch(() => null);
          if (!rootStream) return;
          pipe([toMessage(rootHashes)], rootStream, validateSource).catch(
            (error) => debug && console.error(error)
          );
        });
    }
    Promise.allSettled(
      $leaderboard.map((record) =>
        validateRecord(record).then((gameData) => queues[type].push(gameData))
      )
    ).then(() => leaderboardStore.set(queues[type].data));
  });
});

records.subscribe(($records) => {
  const $phase = get(phase);
  if ($phase !== PHASES.idle && $phase !== PHASES.gameover) return;
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
