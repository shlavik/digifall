import { derived, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS } from "./constants.js";
import {
  checkTransition as coreCheckTransition,
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
export const overlay = writable(INITIAL_VALUES.overlay);
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
  overlay,
  phase,
  plusIndex,
  randomColor,
  records,
  score,
  seed,
  timestamp,
};

export function checkTransition(value, timeout = 0) {
  return coreCheckTransition(game, value, timeout);
}

export function resetGame(showOverlay = false, count = 8) {
  return coreResetGame(game, showOverlay, count);
}

export default game;
