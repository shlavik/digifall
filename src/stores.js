import { writable } from "svelte/store";
import { getFieldInit } from "./utils.js";

const score = writable(0);

const hiScore = writable(0);

const phase = writable("input");

const cards = writable(getFieldInit());

const energy = writable(100);

const shake = writable(0);

const sfx = writable(0);

export { score, hiScore, phase, cards, energy, shake, sfx };
