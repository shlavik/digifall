import { writable } from "svelte/store";
import { getFieldInitial } from "./utils.js";

export const cards = writable(getFieldInitial());
export const energy = writable({ buffer: 0, value: 100 });
export const log = writable([]);
export const options = writable({ shadow: false });
export const overlay = writable(true);
export const phase = writable("idle");
export const rColor = writable("white");
export const score = writable({ buffer: 0, value: 0 });
export const sfx = writable(0);
export const shake = writable(0);

export const initGame = () => {
  cards.set(getFieldInitial());
  energy.set({ buffer: 0, value: 100 });
  log.set([]);
  overlay.set(false);
  phase.set("idle");
  rColor.set("white");
  score.set({ buffer: 0, value: 0 });
}
