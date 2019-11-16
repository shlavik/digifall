import { writable } from "svelte/store";

export const blocks = writable(
  Array(49)
    .fill(undefined)
    .map((_, index) => ({
      type: ~~(Math.random() * 10),
      x: ~~(index / 7),
      y: index % 7
    }))
);
