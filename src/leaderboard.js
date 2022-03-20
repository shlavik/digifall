import { NOISE } from "@chainsafe/libp2p-noise";
import pipe from "it-pipe";
import Libp2p from "libp2p";
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
  if (gameData[KEYS.protocolVersion] !== PROTOCOL_VERSION) {
    throw new Error("RECORD VALIDATION: WRONG PROTOCOL VERSION!");
  }
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
      overlay: writable(INITIAL_VALUES.overlay),
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
      resolve($records[type][KEYS.value] === value);
    });
  });
}

(async function initP2PLeaderboard() {
  const protocol = `/digifall/${PROTOCOL_VERSION}`;

  const trustedPeerIds = [];

  const peerId = await PeerId.createFromJSON(
    get(localStorageStore(KEYS.peerId, (await PeerId.create()).toJSON()))
  );

  const libp2p = await Libp2p.create({
    addresses: {
      listen: [
        "/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/",
      ],
    },
    modules: {
      transport: [WebSockets, WebRTCStar],
      connEncryption: [NOISE],
      streamMuxer: [Mplex],
    },
    peerId,
    connectionManager: {
      maxConnections: 5,
      minConnections: 3,
    },
  });

  const push = async (connection) => {
    const message = [];
    for (type in queues) {
      queues[type].data.forEach(({ playerName, value }) => {
        message.push(JSON.stringify({ type, playerName, value }));
      });
    }
    const { stream } = await connection.newStream(protocol + "/push");
    return pipe(message, stream);
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
      for await (const msg of source) {
        const { type, playerName, value } = JSON.parse(msg.toString());
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
      for await (const msg of source) {
        try {
          const remoteUnique = JSON.parse(msg.toString());
          const { type, playerName, value } = remoteUnique;
          const queue = queues[type];
          const index = queue.indexes.get(playerName);
          if (index !== undefined && queue.data[index].value >= value) continue;
          const recordValid = await validateRecord(remoteUnique);
          if (!recordValid) continue;
          queue.push(remoteUnique);
          leaderboard.update(($leaderboard) => {
            $leaderboard[type] = queue.data;
            return $leaderboard;
          });
          console.warn("P2P LEADERBOARD UPDATED!");
        } catch (error) {
          console.error(error);
          continue;
        }
      }
    });
  });

  libp2p.on("peer:discovery", (peerId) => {
    const isTrusted = trustedPeerIds.includes(peerId.toB58String());
    if (isTrusted) libp2p.dial(peerId);
  });

  libp2p.connectionManager.on("peer:connect", async (connection) => {
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
        const data = $leaderboard[type].filter(
          ({ protocolVersion }) => protocolVersion === PROTOCOL_VERSION
        );
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
})();
