import { derived, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS } from "./constants.js";
import {
  checkSpeedrun as coreCheckSpeedrun,
  getSeed,
  resetGame as coreResetGame,
} from "./core.js";
import { localStorageStore } from "./persistence.js";

export const cards = writable(INITIAL_VALUES.cards);
export const energy = writable(INITIAL_VALUES.energy);
export const log = writable(INITIAL_VALUES.log);
export const matchedIndexes = writable(INITIAL_VALUES.matchedIndexes);
export const moves = localStorageStore(KEYS.moves, INITIAL_VALUES.moves);
export const options = localStorageStore(KEYS.options, INITIAL_VALUES.options);
export const phase = writable(INITIAL_VALUES.phase);
export const plusIndex = writable(INITIAL_VALUES.plusIndex);
export const randomColor = writable(INITIAL_VALUES.randomColor);
export const records = localStorageStore(KEYS.records, INITIAL_VALUES.records);
export const score = writable(INITIAL_VALUES.score);
export const timestamp = localStorageStore(KEYS.timestamp, Date.now());

export const seed = derived(
  [options, timestamp],
  ([{ playerName }, $timestamp]) => {
    return getSeed({ playerName, timestamp: $timestamp });
  }
);

const game = {
  cards,
  energy,
  log,
  matchedIndexes,
  moves,
  options,
  phase,
  plusIndex,
  randomColor,
  records,
  score,
  seed,
  timestamp,
};

export function checkSpeedrun(value, timeout = 0) {
  return coreCheckSpeedrun(game, value, timeout);
}

export function resetGame(count = 8) {
  return coreResetGame(game, count);
}

export const overlay = writable(INITIAL_VALUES.overlay);

export default game;
