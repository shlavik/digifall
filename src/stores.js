import { derived, get, writable } from "svelte/store";

import { INITIAL_VALUES, KEYS } from "./constants.js";

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

export const cards = writable(INITIAL_VALUES.cards);
export const energy = writable(INITIAL_VALUES.energy);
export const leaderboard = localStorageStore(
  KEYS.leaderboard,
  INITIAL_VALUES.leaderboard
);
export const log = writable(INITIAL_VALUES.log);
export const matchedIndexes = writable(INITIAL_VALUES.matchedIndexes);
export const moves = localStorageStore(KEYS.moves, INITIAL_VALUES.moves);
export const options = localStorageStore(KEYS.options, INITIAL_VALUES.options);
export const overlay = writable(INITIAL_VALUES.overlay);
export const phase = writable(INITIAL_VALUES.phase);
export const plusIndex = writable(INITIAL_VALUES.plusIndex);
export const randomColor = writable(INITIAL_VALUES.randomColor);
export const score = writable(INITIAL_VALUES.score);
export const timestamp = localStorageStore(KEYS.timestamp, Date.now());

export const seed = derived(
  [timestamp, options],
  ([$timestamp, { playerName }]) =>
    typeof $timestamp === "number" &&
    $timestamp > 0 &&
    $timestamp < Infinity &&
    typeof playerName === "string" &&
    playerName.length > 0 &&
    [
      $timestamp,
      ...Array.from(playerName).map((letter) => letter.charCodeAt()),
    ].reduce((result, item) => {
      const number = Number(`${result}${item}`);
      return number > MAX_SAFE_INTEGER ? number % MAX_SAFE_INTEGER : number;
    })
);
