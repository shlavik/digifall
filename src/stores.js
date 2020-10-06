import { derived, get, writable } from "svelte/store";

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

const energyInit = { buffer: 0, value: 100 };
const logInit = [];
const matchedIndexesInit = [];
const movesInit = "";
const phaseInit = "init";
const plusIndexInit = undefined;
const randomColorInit = "white";
const scoreInit = { buffer: 0, value: 0 };

export const cards = writable([]);
export const energy = writable(energyInit);
export const leaderboard = localStorageStore("leaderboard", {
  highScores: {},
  highTotals: {},
  local: {
    highScore: {},
    highTotal: {},
  },
});
export const log = writable(logInit);
export const matchedIndexes = writable(matchedIndexesInit);
export const moves = localStorageStore("moves", movesInit);
export const options = localStorageStore("options", {
  playerName: "",
  seedground: true,
  shadows: true,
  transitions: true,
});
export const overlay = writable(true);
export const phase = writable(phaseInit);
export const plusIndex = writable(plusIndexInit);
export const randomColor = writable(randomColorInit);
export const score = writable(scoreInit);
export const timestamp = localStorageStore("timestamp", Date.now());
export const touch = localStorageStore("touch", Date.now());

export const seed = derived(
  [timestamp, options],
  ([$timestamp, { playerName }]) => {
    if (
      typeof $timestamp !== "number" ||
      typeof playerName !== "string" ||
      playerName === ""
    )
      return;
    const { MAX_SAFE_INTEGER } = Number;
    return [
      $timestamp,
      ...[...playerName].map((letter) => letter.charCodeAt()),
    ].reduce((result, item) => {
      const number = Number(`${result}${item}`);
      return number > MAX_SAFE_INTEGER ? number % MAX_SAFE_INTEGER : number;
    });
  }
);

function newTimestamp(count) {
  timestamp.set(Date.now());
  if (count-- > 0) requestAnimationFrame(() => newTimestamp(count));
}

export function initGame(showOverlay = false, count = 12) {
  energy.set(energyInit);
  log.set(logInit);
  matchedIndexes.set(matchedIndexesInit);
  moves.set(movesInit);
  overlay.set(showOverlay);
  phase.set("idle");
  plusIndex.set(plusIndexInit);
  randomColor.set(randomColorInit);
  score.set(scoreInit);
  newTimestamp(get(options).transitions ? count : 0);
}
