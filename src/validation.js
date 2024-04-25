import { get, readable, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS, PHASES } from "./constants.js";
import { getSeed, initCore } from "./core.js";

export async function validateRecord(gameData = {}) {
  const { type, moves, playerName, timestamp, value } = gameData;
  if (!type || !moves || !playerName || !timestamp || !value) {
    throw new Error(["RECORD VALIDATION: BAD GAME DATA!", gameData]);
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(["RECORD VALIDATION: TIMEOUT!", gameData]),
      3333
    );
    const game = initCore({
      cards: writable(INITIAL_VALUES.cards),
      energy: writable(INITIAL_VALUES.energy),
      log: writable(INITIAL_VALUES.log),
      matchedIndexes: writable(INITIAL_VALUES.matchedIndexes),
      moves: readable(moves),
      options: readable({ playerName, cluster: false, rapid: true }),
      phase: writable(INITIAL_VALUES.phase),
      plusIndex: writable(INITIAL_VALUES.plusIndex),
      records: writable({ ...INITIAL_VALUES.records }),
      score: writable(INITIAL_VALUES.score),
      seed: readable(getSeed(gameData)),
      timestamp: readable(timestamp),
    });
    game.records.subscribe(($records) => {
      const { movesInitial, phase } = game;
      if (movesInitial !== null && get(phase) !== PHASES.gameOver) return;
      clearTimeout(timer);
      const recordValue = $records[type][KEYS.value];
      gameData = { type, moves, playerName, timestamp, value };
      if (recordValue >= value) {
        gameData.value = recordValue;
        resolve(gameData);
      } else {
        reject(["RECORD VALIDATION: WRONG VALUE!", gameData, recordValue]);
      }
    });
  });
}
