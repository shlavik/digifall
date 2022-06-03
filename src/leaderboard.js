import { Noise } from "@chainsafe/libp2p-noise";
import { Mplex } from "@libp2p/mplex";
import { WebRTCStar } from "@libp2p/webrtc-star";
import { WebSockets } from "@libp2p/websockets";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { get, readable, writable } from "svelte/store";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

import { INITIAL_VALUES, KEYS, PHASES, PROTOCOL_VERSION } from "./constants.js";
import { getSeed, initCore } from "./core.js";
import { indexedDBStore } from "./persistence.js";
import { options, phase, records } from "./stores";
import { UniQueue } from "./uniqueue.js";

const debug = false;
const protocol = `/digifall/${PROTOCOL_VERSION}`;

let libp2p;

export const leaderboard = indexedDBStore(
  KEYS.leaderboard,
  INITIAL_VALUES.leaderboard
);

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
      if (game.movesInitial !== null) return;
      clearTimeout(timer);
      const recordValue = $records[type][KEYS.value];
      if (recordValue === value) resolve(recordValue);
      else if (debug) console.warn(recordValue, gameData);
      reject("RECORD VALIDATION: WRONG VALUE!");
    });
  });
}

async function push(connection) {
  const messages = [];
  for (const type in queues) {
    queues[type].data.forEach(({ playerName, value }) => {
      const json = JSON.stringify({ type, playerName, value });
      messages.push(uint8ArrayFromString(json));
    });
  }
  const { stream } = await connection.newStream(protocol + "/push");
  return pipe(messages, stream);
}

async function handlePull({ connection }) {
  if (debug) console.log("/pull");
  return push(connection);
}

async function handlePush({ stream: input, connection }) {
  if (debug) console.log("/push");
  const remoteActualNames = {
    [KEYS.highCombo]: new Set(),
    [KEYS.highScore]: new Set(),
  };
  await pipe(input, async (source) => {
    for await (const message of source) {
      const json = uint8ArrayToString(message);
      const { type, playerName, value } = JSON.parse(json);
      const index = queues[type].indexes.get(playerName);
      if (index === undefined) continue;
      if (queues[type].data[index].value > value) continue;
      remoteActualNames[type].add(playerName);
    }
  });
  const localUniques = [];
  for (const type in queues) {
    queues[type].data
      .filter(({ playerName }) => !remoteActualNames[type].has(playerName))
      .forEach((gameData) => {
        gameData[KEYS.type] = type;
        const json = JSON.stringify(gameData);
        localUniques.push(uint8ArrayFromString(json));
      });
  }
  if (localUniques.length === 0) return;
  const { stream } = await connection.newStream(protocol + "/validate");
  return pipe(localUniques, stream);
}

async function handleValidate({ stream: input }) {
  if (debug) console.log("/validate");
  let touched = false;
  await pipe(input, async (source) => {
    for await (const message of source) {
      try {
        const json = uint8ArrayToString(message);
        const remoteUnique = JSON.parse(json);
        const { type, playerName, value } = remoteUnique;
        const { data, indexes } = queues[type];
        const index = indexes.get(playerName);
        if (index in data && data[index].value >= value) continue;
        await validateRecord(remoteUnique);
        leaderboard.update(($leaderboard) => {
          queues[type].push(remoteUnique);
          $leaderboard[type] = queues[type].data;
          return $leaderboard;
        });
        touched = true;
        console.warn("P2P LEADERBOARD UPDATED!", type, playerName, value);
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  });
  if (!touched) return;
  libp2p.connectionManager.connections.forEach(([connection]) => {
    connection.newStream(protocol + "/pull");
  });
}

function handlePeerDiscovery({ detail: peer }) {
  if (debug) console.log("peer:discovery", peer.id.toString());
}

async function handlePeerConnect({ detail: connection }) {
  if (debug) console.log("peer:connect", connection.remotePeer.toString());
  try {
    await push(connection);
  } catch (error) {
    console.error(error);
    if (error.message !== "protocol selection failed") return;
    libp2p.connectionGater.denyDialPeer(connection.remotePeer);
    connection.close();
  }
}

(async function initP2PLeaderboard() {
  const webRtcStar = new WebRTCStar();
  libp2p = await createLibp2p({
    addresses: {
      listen: ["/dns4/star.digifall.app/tcp/8443/wss/p2p-webrtc-star"],
    },
    transports: [new WebSockets(), webRtcStar],
    connectionEncryption: [new Noise()],
    streamMuxers: [new Mplex()],
    peerDiscovery: [webRtcStar.discovery],
    connectionManager: {
      maxConnections: 5,
      minConnections: 3,
    },
  });
  libp2p.handle(protocol + "/pull", handlePull);
  libp2p.handle(protocol + "/push", handlePush);
  libp2p.handle(protocol + "/validate", handleValidate);
  libp2p.addEventListener("peer:discovery", handlePeerDiscovery);
  libp2p.connectionManager.addEventListener("peer:connect", handlePeerConnect);
  if (debug) window.libp2p = libp2p;
})();

leaderboard.subscribe(async ($leaderboard) => {
  if (!$leaderboard) return;
  const leaderboardEmpty =
    $leaderboard[KEYS.highCombo].length === 0 &&
    $leaderboard[KEYS.highScore].length === 0;
  if (leaderboardEmpty) return;
  const queuesEmpty =
    queues[KEYS.highCombo].data.length === 0 &&
    queues[KEYS.highScore].data.length === 0;
  if (queuesEmpty) {
    for (const type in queues) {
      for (const record of $leaderboard[type]) {
        try {
          await validateRecord(record);
          queues[type].push(record);
        } catch (error) {
          console.error(error);
          continue;
        }
      }
      $leaderboard[type] = queues[type].data;
    }
    leaderboard.set({ ...$leaderboard });
  }
});

records.subscribe(($records) => {
  const $phase = get(phase);
  if ($phase !== PHASES.idle && $phase !== PHASES.gameover) return;
  leaderboard.update(($leaderboard) => {
    for (const type in queues) {
      const record = $records[type];
      if (record[KEYS.value] === 0) return;
      record[KEYS.type] = type;
      record[KEYS.protocolVersion] = PROTOCOL_VERSION;
      queues[type].push(record);
      $leaderboard[type] = queues[type].data;
    }
    return $leaderboard;
  });
});

options.subscribe(({ leaderboard }) => {
  setTimeout(() => (leaderboard ? libp2p.start() : libp2p.stop()), 3333);
});
