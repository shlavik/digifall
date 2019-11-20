import { writable } from "svelte/store";
import { getFieldUndefined } from "./utils";

const score = writable(0);

const hiScore = writable(0);

const phase = writable("init");

const blocks = writable(
  Array(49)
    .fill(undefined)
    .map((_, index) => ({
      type: ~~(Math.random() * 10),
      duration: 250,
      x: ~~(index / 7),
      y: index % 7
    }))
);

const field = writable(getFieldUndefined());

const energy = writable(100);

const shake = writable(0);

const sfx = writable(0);

export { score, hiScore, phase, blocks, field, energy, shake, sfx };
