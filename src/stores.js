import { writable } from "svelte/store";
import { getFieldInitial } from "./utils.js";

export const cards = writable(getFieldInitial());
export const energy = writable(100);
export const hiScore = writable(0);
export const log = writable([]);
export const options = writable({});
export const overlay = writable(true);
export const phase = writable("idle");
export const score = writable(0);
export const sfx = writable(0);
export const shake = writable(0);

export const initGame = () => {
  cards.set(getFieldInitial());
  energy.set(100);
  log.set([]);
  overlay.set(false);
  phase.set("idle");
  score.set(0);
}
