import { writable } from "svelte/store";
import { getFieldInitial } from "./utils.js";

export const score = writable(0);

export const hiScore = writable(0);

export const phase = writable("input");

export const cards = writable(getFieldInitial());

export const energy = writable(100);

export const shake = writable(0);

export const sfx = writable(0);
