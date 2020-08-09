import { derived, writable } from "svelte/store";
import { getFieldInitial } from "./utils.js";

const energyInit = { buffer: 0, value: 100 };
const logInit = [];
const phaseInit = "idle";
const randomColorInit = "white";
const scoreInit = { buffer: 0, value: 0 };

export const cards = writable([]);
export const energy = writable(energyInit);
export const log = writable(logInit);
export const options = writable({
  name: "",
  timestamp: Date.now(),
  shadow: true,
});
export const overlay = writable(true);
export const phase = writable(phaseInit);
export const randomColor = writable(randomColorInit);
export const score = writable(scoreInit);
export const sfx = writable(0);
export const shake = writable(0);

export const seed = derived(
  options,
  ({ name, timestamp }) => `${name}_${timestamp}`
);

seed.subscribe(($seed) => cards.set(getFieldInitial()));

export const initGame = () => {
  energy.set(energyInit);
  log.set(logInit);
  options.update(($options) => ({ ...$options, timestamp: Date.now() }));
  overlay.set(false);
  phase.set("idle");
  randomColor.set(randomColorInit);
  score.set(scoreInit);
};
