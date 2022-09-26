import { GossipSub } from "@chainsafe/libp2p-gossipsub";
import { Noise } from "@chainsafe/libp2p-noise";
import { Bootstrap } from "@libp2p/bootstrap";
import { Mplex } from "@libp2p/mplex";
import { createEd25519PeerId, createFromJSON } from "@libp2p/peer-id-factory";
import { PubSubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { WebSockets } from "@libp2p/websockets";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { get, readable, writable } from "svelte/store";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

import { INITIAL_VALUES, KEYS, PHASES } from "./constants.js";
import { getSeed, initCore } from "./core.js";
import { createIndexedDBStore, localStorageStore } from "./persistence.js";
import { options, phase, records } from "./stores.js";
import { UniQueue } from "./uniqueue.js";

const PROTOCOL_PREFIX = "/digifall";
const PROTOCOLS = {
  pull: PROTOCOL_PREFIX + "/pull",
  push: PROTOCOL_PREFIX + "/push",
  validate: PROTOCOL_PREFIX + "/validate",
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

export const leaderboards = {
  [KEYS.highCombo]: indexedDBStore(
    KEYS.highCombo,
    INITIAL_VALUES[KEYS.leaderboard][KEYS.highCombo]
  ),
  [KEYS.highScore]: indexedDBStore(
    KEYS.highScore,
    INITIAL_VALUES[KEYS.leaderboard][KEYS.highScore]
  ),
};

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

const queues = {
  [KEYS.highCombo]: new UniQueue({
    maxSize,
    compare,
    extractKey,
  }),
  [KEYS.highScore]: new UniQueue({
    maxSize,
    compare,
    extractKey,
  }),
};

async function validateRecord(gameData = {}) {
  const { type, moves, playerName, timestamp, value } = gameData;
  if (!type || !moves || !playerName || !timestamp || !value) {
    throw new Error("RECORD VALIDATION: BAD GAME DATA!");
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject("RECORD VALIDATION: TIMEOUT!"), 3333);
    const game = initCore({
      cards: writable(INITIAL_VALUES.cards),
      energy: writable(INITIAL_VALUES.energy),
      log: writable(INITIAL_VALUES.log),
      matchedIndexes: writable(INITIAL_VALUES.matchedIndexes),
      moves: readable(moves),
      options: readable({ playerName, speedrun: true }),
      phase: writable(INITIAL_VALUES.phase),
      plusIndex: writable(INITIAL_VALUES.plusIndex),
      records: writable({ ...INITIAL_VALUES.records }),
      score: writable(INITIAL_VALUES.score),
      seed: readable(getSeed(gameData)),
      timestamp: readable(timestamp),
    });
    game.records.subscribe(($records) => {
      const { movesInitial, phase } = game;
      if (movesInitial !== null && get(phase) !== PHASES.gameover) return;
      clearTimeout(timer);
      const recordValue = $records[type][KEYS.value];
      gameData = { type, moves, playerName, timestamp, value };
      if (recordValue >= value) {
        gameData.value = recordValue;
        resolve(gameData);
      } else if (debug) console.warn(recordValue, gameData);
      reject("RECORD VALIDATION: WRONG VALUE!");
    });
  });
}

async function push(connection) {
  const messages = [KEYS.highCombo, KEYS.highScore].flatMap((type) =>
    queues[type].data.map(({ playerName, value }) => {
      const json = JSON.stringify({ type, playerName, value });
      return uint8ArrayFromString(json);
    })
  );
  try {
    if (debug) console.log(PROTOCOLS.push);
    const stream = await connection.newStream(PROTOCOLS.push);
    return await pipe(messages, stream);
  } catch (error) {
    if (debug) console.error(error);
  }
}

async function handlePull({ connection }) {
  if (debug) console.log("handlePull");
  return await push(connection);
}

async function handlePush({ stream: input, connection }) {
  if (debug) console.log("handlePush");
  const remoteActualNames = {
    [KEYS.highCombo]: new Set(),
    [KEYS.highScore]: new Set(),
  };
  await pipe(input, async (source) => {
    for await (const message of source) {
      const json = uint8ArrayToString(message.subarray());
      const { type, playerName, value } = JSON.parse(json);
      const index = queues[type].indexes.get(playerName);
      if (index === undefined) continue;
      if (queues[type].data[index].value > value) continue;
      remoteActualNames[type].add(playerName);
    }
  });
  const localUniques = [KEYS.highCombo, KEYS.highScore].flatMap((type) =>
    queues[type].data
      .filter(({ playerName }) => !remoteActualNames[type].has(playerName))
      .map((gameData) => {
        gameData[KEYS.type] = type;
        const json = JSON.stringify(gameData);
        return uint8ArrayFromString(json);
      })
  );
  if (localUniques.length === 0) return;
  try {
    if (debug) console.log(PROTOCOLS.validate);
    const stream = await connection.newStream(PROTOCOLS.validate);
    return await pipe(localUniques, stream);
  } catch (error) {
    if (debug) console.error(error);
  }
}

async function handleValidate({ stream: input }) {
  if (debug) console.log("handleValidate");
  let touched = false;
  await pipe(input, async (source) => {
    for await (const message of source) {
      try {
        const json = uint8ArrayToString(message.subarray());
        const remoteUnique = JSON.parse(json);
        const { type, playerName, value } = remoteUnique;
        const { data, indexes } = queues[type];
        const index = indexes.get(playerName);
        if (index in data && data[index].value >= value) continue;
        const gameData = await validateRecord(remoteUnique);
        queues[type].push(gameData);
        leaderboards[type].set(queues[type].data);
        touched = true;
        console.warn("P2P LEADERBOARD UPDATED!", type, playerName, value);
      } catch (error) {
        if (debug) console.error(error);
        continue;
      }
    }
  });
  if (!touched) return;
  libp2p.connectionManager.connections.forEach(([connection]) => {
    const remotePeerId = connection.remotePeer.toString();
    if (remotePeerId === RELAY_PEER_ID) return;
    try {
      if (debug) console.log(PROTOCOLS.pull);
      connection.newStream(PROTOCOLS.pull);
    } catch (error) {
      if (debug) console.error(error);
    }
  });
}

function handlePeerDiscovery({ detail: peer }) {
  if (debug) console.log("peer:discovery", peer.id.toString());
}

async function handlePeerConnect({ detail: connection }) {
  const remotePeerId = connection.remotePeer.toString();
  if (debug) console.log("peer:connect", remotePeerId);
  if (remotePeerId === RELAY_PEER_ID) return;
  try {
    await push(connection);
  } catch (error) {
    if (debug) console.error(error);
    if (error.message !== "protocol selection failed") return;
    libp2p.components.connectionGater.denyDialPeer(connection.remotePeer);
    connection.close();
  }
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
    transports: [new WebSockets()],
    streamMuxers: [new Mplex()],
    connectionEncryption: [new Noise()],
    pubsub: new GossipSub({ allowPublishToZeroPeers: true }),
    peerDiscovery: [
      new Bootstrap({
        list: [RELAY_MULTIADDR],
      }),
      new PubSubPeerDiscovery({
        topics: [`digifall._peer-discovery._p2p._pubsub`],
        interval: 10e3,
      }),
    ],
    connectionManager: {
      minConnections: 2,
      maxConnections: 3,
    },
    relay: {
      enabled: true,
      autoRelay: {
        enabled: true,
        maxListeners: 2,
      },
    },
  });
  libp2p.handle(PROTOCOLS.pull, handlePull);
  libp2p.handle(PROTOCOLS.push, handlePush);
  libp2p.handle(PROTOCOLS.validate, handleValidate);
  libp2p.addEventListener("peer:discovery", handlePeerDiscovery);
  libp2p.connectionManager.addEventListener("peer:connect", handlePeerConnect);
  if (debug) window.libp2p = libp2p;
})();

[KEYS.highCombo, KEYS.highScore].forEach((type) => {
  const leaderboard = leaderboards[type];
  leaderboard.subscribe(async ($leaderboard) => {
    if (!$leaderboard || $leaderboard.length === 0) return;
    if (queues[type].data.length > 0) return;
    await Promise.allSettled(
      $leaderboard.map((record) =>
        validateRecord(record).then((gameData) => queues[type].push(gameData))
      )
    );
    leaderboard.set(queues[type].data);
  });
});

records.subscribe(($records) => {
  const $phase = get(phase);
  if ($phase !== PHASES.idle && $phase !== PHASES.gameover) return;
  [KEYS.highCombo, KEYS.highScore].forEach((type) => {
    const record = $records[type];
    if (record[KEYS.value] === 0) return;
    record[KEYS.type] = type;
    queues[type].push(record);
    leaderboards[type].set(queues[type].data);
  });
});

options.subscribe(({ leaderboard }) => {
  setTimeout(() => (leaderboard ? libp2p.start() : libp2p.stop()), 3333);
});
