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
const phaseInit = "idle";
const plusIndexInit = undefined;
const randomColorInit = "white";
const scoreInit = { buffer: 0, value: 0 };

export const cards = writable([]);
export const energy = writable(energyInit);
export const game = localStorageStore("game", {
  timestamp: Date.now(),
  moves: [],
});
export const leaderboard = localStorageStore("leaderboard", {
  bestMoves: {},
  highScores: {},
  size: 8,
});
export const log = writable(logInit);
export const matchedIndexes = writable(matchedIndexesInit);
export const options = localStorageStore("options", {
  playerName: "",
  scoreLabel: false,
  seedground: true,
  shadows: true,
  transitions: true,
});
export const overlay = writable(true);
export const phase = writable(phaseInit);
export const plusIndex = writable(plusIndexInit);
export const randomColor = writable(randomColorInit);
export const score = writable(scoreInit);

export const seed = derived(
  [game, options],
  ([{ timestamp }, { playerName }]) => {
    if (typeof timestamp !== "number" || typeof playerName !== "string" || playerName === "")
      return;
    const { MAX_SAFE_INTEGER } = Number;
    return [
      timestamp,
      ...[...playerName].map((letter) => letter.charCodeAt()),
    ].reduce((result, item) => {
      const number = Number(`${result}${item}`);
      return number > MAX_SAFE_INTEGER ? number % MAX_SAFE_INTEGER : number;
    });
  }
);

export function initGame() {
  energy.set(energyInit);
  game.set({
    timestamp: Date.now(),
    moves: [],
  });
  log.set(logInit);
  matchedIndexes.set(matchedIndexesInit);
  overlay.set(false);
  phase.set("idle");
  plusIndex.set(plusIndexInit);
  randomColor.set(randomColorInit);
  score.set(scoreInit);
}
