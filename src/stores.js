import { derived, writable } from "svelte/store";

const energyInit = { buffer: 0, value: 100 };
const logInit = [];
const matchedIndexesInit = [];
const phaseInit = "idle";
const plusIndexInit = undefined;
const randomColorInit = "white";
const scoreInit = { buffer: 0, value: 0 };

export const cards = writable([]);
export const energy = writable(energyInit);
export const game = writable({
  timestamp: Date.now(),
  moves: [],
  score: 0,
});
export const log = writable(logInit);
export const matchedIndexes = writable(matchedIndexesInit);
export const options = writable({
  playerName: "playerName",
  scoreLabel: false,
  seedGround: true,
  shadow: true,
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
    score: 0,
  });
  log.set(logInit);
  matchedIndexes.set(matchedIndexesInit);
  overlay.set(false);
  phase.set("idle");
  plusIndex.set(plusIndexInit);
  randomColor.set(randomColorInit);
  score.set(scoreInit);
}
