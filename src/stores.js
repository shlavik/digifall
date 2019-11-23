import { writable } from "svelte/store";

const score = writable(0);

const hiScore = writable(0);

const phase = writable("input");

const blocks = writable(
  Array(49)
    .fill(undefined)
    .map((_, index) => ({
      duration: 0,
      type: ~~(Math.random() * 10),
      x: ~~(index / 7),
      y: index % 7
    }))
);

const energy = writable(100);

const shake = writable(0);

const sfx = writable(0);

export { score, hiScore, phase, blocks, energy, shake, sfx };
