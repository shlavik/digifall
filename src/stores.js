import { derived, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS } from "./constants.js";
import {
  checkSound as coreCheckSound,
  checkRapid as coreCheckRapid,
  resetGame as coreResetGame,
  getComboFromLog,
  getSeed,
} from "./core.js";
import { localStorageStore } from "./persistence.js";
import { playWordUp } from "./sounds.js";

export const cards = writable(INITIAL_VALUES.cards);
export const energy = writable(INITIAL_VALUES.energy);
export const log = writable(INITIAL_VALUES.log);
export const matchedIndexes = writable(INITIAL_VALUES.matchedIndexes);
export const moves = localStorageStore(KEYS.moves, INITIAL_VALUES.moves);
export const options = localStorageStore(KEYS.options, INITIAL_VALUES.options);
export const phase = writable(INITIAL_VALUES.phase);
export const plusIndex = writable(INITIAL_VALUES.plusIndex);
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
  records,
  score,
  seed,
  timestamp,
  ready: true,
};

export function checkRapid(value, timeout = 0) {
  return coreCheckRapid(game, value, timeout);
}

export function checkSound(callback, { muteRapid = false } = {}) {
  return coreCheckSound(game, callback, { muteRapid });
}

export function resetGame(playerName) {
  overlay.set(null);
  coreResetGame(game, playerName);
}

export const combos = derived(
  [log, options, seed],
  ([$log, { rapid }, $seed]) => {
    if (!rapid) return [];
    if ($seed !== combos.seed) {
      combos.seed = $seed;
      combos.prev = [];
      combos.rows = [];
    }
    if ($log.length === 0) {
      const combo = getComboFromLog(combos.prev);
      if (combo) {
        combos.rows = [...combos.rows, { combo, key: performance.now() }];
        checkSound(playWordUp);
        if (combos.rows.length > 7) combos.rows = combos.rows.slice(-7);
      }
    } else {
      combos.prev = $log;
    }
    return combos.rows;
  }
);

export const overlay = writable(INITIAL_VALUES.overlay);

export default game;
