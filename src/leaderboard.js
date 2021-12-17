import { get, readable, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS, PHASES } from "./constants.js";
import { getSeed, initCore } from "./core.js";

export async function isRecordValid(
  { moves, playerName, timestamp } = {},
  key,
  value
) {
  if (
    !moves ||
    typeof moves !== "string" ||
    !playerName ||
    typeof playerName !== "string" ||
    !timestamp ||
    typeof timestamp !== "number" ||
    !key ||
    (key !== KEYS.highCombo && key !== KEYS.highScore) ||
    !value ||
    typeof value !== "number"
  ) {
    throw "RECORD VALIDATION: Wrong arguments!";
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject("RECORD VALIDATION: Timeout!"), 800);
    const game = {
      cards: writable(INITIAL_VALUES.cards),
      energy: writable(INITIAL_VALUES.energy),
      leaderboard: writable(INITIAL_VALUES.leaderboard),
      log: writable(INITIAL_VALUES.log),
      matchedIndexes: writable(INITIAL_VALUES.matchedIndexes),
      moves: readable(moves),
      options: readable({ playerName, transitions: false }),
      overlay: writable(INITIAL_VALUES.overlay),
      phase: writable(INITIAL_VALUES.phase),
      plusIndex: writable(INITIAL_VALUES.plusIndex),
      randomColor: readable(INITIAL_VALUES.randomColor),
      score: writable(INITIAL_VALUES.score),
      seed: readable(getSeed(playerName, timestamp)),
      timestamp: readable(timestamp),
    };
    initCore(game);
    game.leaderboard.subscribe(($leaderboard) => {
      const { movesInitial, phase } = game;
      if (movesInitial !== null && get(phase) !== PHASES.gameover) return;
      clearTimeout(timer);
      const result = $leaderboard[KEYS.local][key].hasOwnProperty(value);
      resolve(result);
    });
  });
}
