<script>
  import { phase, energy } from "./stores.js";
  import Game from "./Game.svelte";

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const getRandomColor = (lightness = 10) =>
    `hsl(${Math.floor(Math.random() * 360)},100%,${lightness}%)`;

  const getNewAppStyle = () => {
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
    return `
      background-color: ${getRandomColor()};
      background-image:
        linear-gradient(90deg, ${getRandomColor()} 50%, transparent 50%),
        linear-gradient(90deg, ${getRandomColor()} 50%, transparent 50%),
        linear-gradient(90deg, transparent 50%, ${getRandomColor()} 50%),
        linear-gradient(90deg, transparent 50%, ${getRandomColor()} 50%);
      background-position: center;
      background-size:
        calc(${a} * var(--pixel)),
        calc(${b} * var(--pixel)),
        calc(${c} * var(--pixel)),
        calc(${d} * var(--pixel));
  `;
  };

  let style = getNewAppStyle();

  window.onresize = () => {
    style =
      window.innerHeight / window.innerWidth > 1.5
        ? undefined
        : getNewAppStyle();
  };
</script>

<style>
  .app {
    overflow: hidden;
  }
</style>

<svelte:window
  on:keypress={({ key }) => {
    if (key === '1') energy.set(10);
    if (key === '0') energy.set(100);
  }} />

<div class="app" {style}>
  <span style="color: white; position: absolute">{$phase}</span>
  <Game />
</div>
