<script>
  import { phase, energy } from "./stores.js";
  import { shuffleArray } from "./utils.js";
  import Game from "./Game.svelte";

  const [a, b, c, d] = shuffleArray([
    7,
    11,
    13,
    17,
    19,
    23,
    29,
    31,
    37,
    41,
    43,
    47,
    53,
    59,
    61,
    67,
    71,
    73,
    79,
    83,
    89,
    97
  ]);

  const style = `
    background-image:
      linear-gradient(90deg, hsla(${Math.random() * 255},100%,50%,.05) 50%, transparent 50%),
      linear-gradient(90deg, hsla(${Math.random() * 255},100%,50%,.05) 50%, transparent 50%),
      linear-gradient(90deg, transparent 50%, hsla(${Math.random() * 255},100%,50%,.05) 50%),
      linear-gradient(90deg, transparent 50%, hsla(${Math.random() * 255},100%,50%,.05) 50%);
    background-size:
      calc(${a} * var(--pixel)),
      calc(${b} * var(--pixel)),
      calc(${c} * var(--pixel)),
      calc(${d} * var(--pixel));
  `;
</script>

<svelte:window
  on:keypress={({ key }) => {
    if (key === '1') energy.set(10);
    if (key === '0') energy.set(100);
  }} />

<div {style}>
  <span style="color: white; position: absolute">{$phase}</span>
  <Game />
</div>
