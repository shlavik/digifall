import { NOISE } from "@chainsafe/libp2p-noise";
import pipe from "it-pipe";
import Libp2p from "libp2p";
import KadDHT from "libp2p-kad-dht";
import Mplex from "libp2p-mplex";
import WebRTCStar from "libp2p-webrtc-star";
import WebSockets from "libp2p-websockets";
import PeerId from "peer-id";
import { get, readable, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS, PHASES, PROTOCOL_VERSION } from "./constants.js";
import { getSeed, initCore } from "./core.js";
import { indexedDBStore, localStorageStore } from "./persistence.js";
import { options, phase, records } from "./stores";
import { UniQueue } from "./uniqueue.js";

const debug = false;

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
    const timer = setTimeout(() => reject("RECORD VALIDATION: TIMEOUT!"), 9999);
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

(async function initP2PLeaderboard() {
  const protocol = `/digifall/${PROTOCOL_VERSION}`;

  const peerId = await PeerId.createFromJSON(
    get(localStorageStore(KEYS.peerId, (await PeerId.create()).toJSON()))
  );

  const libp2p = await Libp2p.create({
    addresses: {
      listen: ["/dns4/star.digifall.app/tcp/8443/wss/p2p-webrtc-star"],
    },
    modules: {
      transport: [WebSockets, WebRTCStar],
      connEncryption: [NOISE],
      streamMuxer: [Mplex],
      dht: KadDHT,
    },
    peerId,
    connectionManager: {
      maxConnections: 5,
      minConnections: 3,
    },
    config: {
      dht: {
        enabled: true,
        kBucketSize: 20,
      },
    },
  });

  const push = async (connection) => {
    const messages = [];
    for (type in queues) {
      queues[type].data.forEach(({ playerName, value }) => {
        messages.push(JSON.stringify({ type, playerName, value }));
      });
    }
    const { stream } = await connection.newStream(protocol + "/push");
    return pipe(messages, stream);
  };

  libp2p.handle(protocol + "/pull", async ({ connection }) => {
    push(connection);
  });

  libp2p.handle(protocol + "/push", async ({ stream: input, connection }) => {
    const remoteActualNames = {
      [KEYS.highCombo]: new Set(),
      [KEYS.highScore]: new Set(),
    };
    await pipe(input, async (source) => {
      for await (const message of source) {
        const { type, playerName, value } = JSON.parse(message.toString());
        const queue = queues[type];
        const index = queue.indexes.get(playerName);
        if (index === undefined) continue;
        if (queue.data[index].value > value) continue;
        remoteActualNames[type].add(playerName);
      }
    });
    const localUniques = [];
    for (const type in queues) {
      queues[type].data
        .filter(({ playerName }) => !remoteActualNames[type].has(playerName))
        .forEach((gameData) => {
          gameData[KEYS.type] = type;
          localUniques.push(JSON.stringify(gameData));
        });
    }
    if (localUniques.length === 0) return;
    const { stream } = await connection.newStream(protocol + "/validate");
    pipe(localUniques, stream);
  });

  libp2p.handle(protocol + "/validate", async ({ stream: input }) => {
    pipe(input, async (source) => {
      for await (const message of source) {
        try {
          const remoteUnique = JSON.parse(message.toString());
          const { type, playerName, value } = remoteUnique;
          const queue = queues[type];
          const index = queue.indexes.get(playerName);
          if (index !== undefined && queue.data[index].value >= value) continue;
          await validateRecord(remoteUnique);
          leaderboard.update(($leaderboard) => {
            queue.push(remoteUnique);
            $leaderboard[type] = queue.data;
            return $leaderboard;
          });
          console.warn("P2P LEADERBOARD UPDATED!", playerName, type, value);
        } catch (error) {
          console.error(error);
          continue;
        }
      }
    });
  });

  libp2p.on("peer:discovery", (peerId) => {
    const peerIdB58String = peerId.toB58String();
    if (debug) console.log("peer:discovery", peerIdB58String);
  });

  libp2p.connectionManager.on("peer:connect", async (connection) => {
    const peerIdB58String = connection.remotePeer.toB58String();
    if (debug) console.log("peer:connect", peerIdB58String);
    try {
      await push(connection);
    } catch (error) {
      if (error.message !== "protocol selection failed") return;
      libp2p.connectionGater.denyDialPeer(connection.remotePeer);
      connection.close();
    }
  });

  leaderboard.subscribe(($leaderboard) => {
    const leaderboardEmpty =
      $leaderboard[KEYS.highCombo].length === 0 &&
      $leaderboard[KEYS.highScore].length === 0;
    const queuesEmpty =
      queues[KEYS.highCombo].data.length === 0 &&
      queues[KEYS.highScore].data.length === 0;
    if (queuesEmpty) {
      if (leaderboardEmpty) return;
      for (let type in queues) {
        const data = $leaderboard[type];
        queues[type] = new UniQueue({
          data,
          maxSize,
          compare,
          extractKey,
        });
      }
      return;
    }
    if (leaderboardEmpty) return;
    if ($leaderboard[KEYS.protocolVersion] !== PROTOCOL_VERSION) {
      leaderboard.set(INITIAL_VALUES.leaderboard);
      return;
    }
    libp2p.connections.forEach(([connection]) => {
      connection.newStream(protocol + "/pull");
    });
  });

  records.subscribe(($records) => {
    const $phase = get(phase);
    if ($phase !== PHASES.idle && $phase !== PHASES.gameover) return;
    leaderboard.update(($leaderboard) => {
      for (let type in queues) {
        const record = $records[type];
        if (record[KEYS.value] === 0) continue;
        record[KEYS.type] = type;
        record[KEYS.protocolVersion] = PROTOCOL_VERSION;
        const queue = queues[type];
        queue.push(record);
        $leaderboard[type] = queue.data;
      }
      return $leaderboard;
    });
  });

  options.subscribe(({ leaderboard }) => {
    setTimeout(() => (leaderboard ? libp2p.start() : libp2p.stop()), 3333);
  });

  if (debug) window.libp2p = libp2p;
})();
