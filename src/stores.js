import { writable } from "svelte/store";

const score = writable(0);

const hiScore = writable(0);

const phase = writable("init");

const blocks = writable(
  Array(49)
    .fill(undefined)
    .map((_, index) => ({
      type: ~~(Math.random() * 10),
      group: 0,
      duration: 250,
      x: ~~(index / 7),
      y: index % 7
    }))
);

const getDefaultField = () => {
  const arr0 = Array(14).fill(undefined);
  const arr1 = Array(14).fill(undefined);
  const arr2 = Array(14).fill(undefined);
  const arr3 = Array(14).fill(undefined);
  const arr4 = Array(14).fill(undefined);
  const arr5 = Array(14).fill(undefined);
  const arr6 = Array(14).fill(undefined);
  return [arr0, arr1, arr2, arr3, arr4, arr5, arr6];
};

const field = writable(getDefaultField());

const energy = writable(100);

const shake = writable(0);

const sfx = writable(0);

export {
  score,
  hiScore,
  phase,
  blocks,
  field,
  getDefaultField,
  energy,
  shake,
  sfx
};
