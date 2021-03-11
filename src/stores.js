import { derived, get, writable } from "svelte/store";

import {
  INITIAL_CARDS,
  INITIAL_ENERGY,
  INITIAL_LEADERBOARD,
  INITIAL_LOG,
  INITIAL_MATCHED_INDEXES,
  INITIAL_MOVES,
  INITIAL_OPTIONS,
  INITIAL_OVERLAY,
  INITIAL_PHASE,
  INITIAL_PLUS_INDEX,
  INITIAL_RANDOM_COLOR,
  INITIAL_SCORE,
  KEY_LEADERBOARD,
  KEY_MOVES,
  KEY_OPTIONS,
  KEY_TIMESTAMP,
  KEY_TOUCH,
  TYPE_NUMBER,
  TYPE_STRING,
} from "./constants.js";

const { MAX_SAFE_INTEGER } = Number;

export function localStorageStore(key, initialValue) {
  const store = writable(initialValue);
  const { set, subscribe } = store;
  const json = localStorage.getItem(key);
  if (json) {
    set(JSON.parse(json));
  } else {
    localStorage.setItem(key, JSON.stringify(initialValue));
  }
  return {
    set(value) {
      localStorage.setItem(key, JSON.stringify(value));
      set(value);
    },
    update(cb) {
      this.set(cb(get(store)));
    },
    subscribe,
  };
}

export const cards = writable(INITIAL_CARDS);
export const energy = writable(INITIAL_ENERGY);
export const leaderboard = localStorageStore(
  KEY_LEADERBOARD,
  INITIAL_LEADERBOARD
);
export const log = writable(INITIAL_LOG);
export const matchedIndexes = writable(INITIAL_MATCHED_INDEXES);
export const moves = localStorageStore(KEY_MOVES, INITIAL_MOVES);
export const options = localStorageStore(KEY_OPTIONS, INITIAL_OPTIONS);
export const overlay = writable(INITIAL_OVERLAY);
export const phase = writable(INITIAL_PHASE);
export const plusIndex = writable(INITIAL_PLUS_INDEX);
export const randomColor = writable(INITIAL_RANDOM_COLOR);
export const score = writable(INITIAL_SCORE);
export const timestamp = localStorageStore(KEY_TIMESTAMP, Date.now());
export const touch = localStorageStore(KEY_TOUCH, Date.now());

export const seed = derived(
  [timestamp, options],
  ([$timestamp, { playerName }]) =>
    typeof $timestamp === TYPE_NUMBER &&
    typeof playerName === TYPE_STRING &&
    playerName.length > 0 &&
    [$timestamp]
      .concat(Array.from(playerName).map((letter) => letter.charCodeAt()))
      .reduce((result, item) => {
        const number = Number(`${result}${item}`);
        return number > MAX_SAFE_INTEGER ? number % MAX_SAFE_INTEGER : number;
      })
);

function newTimestamp(count) {
  phase.set(INITIAL_PHASE);
  timestamp.set(Date.now());
  if (count-- > 0) requestAnimationFrame(() => newTimestamp(count));
}

export function initGame(showOverlay = false, count = 12) {
  energy.set(INITIAL_ENERGY);
  log.set(INITIAL_LOG);
  matchedIndexes.set(INITIAL_MATCHED_INDEXES);
  moves.set(INITIAL_MOVES);
  overlay.set(showOverlay);
  plusIndex.set(INITIAL_PLUS_INDEX);
  randomColor.set(INITIAL_RANDOM_COLOR);
  score.set(INITIAL_SCORE);
  newTimestamp(get(options).transitions ? count : 0);
}
