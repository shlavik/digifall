<script>
  import { onMount } from "svelte";
  import { energy, overlay, phase } from "./stores.js";
  import Game from "./Game.svelte";
  import GameOver from "./GameOver.svelte";
  import Menu from "./Menu.svelte";
  import Overlay from "./Overlay.svelte";

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
        calc(${d} * var(--pixel));`;
  };

  let appStyle = getNewAppStyle();

  const updateAppStyle = () => {
    const { style } = document.documentElement;
    const { offsetHeight, offsetWidth } = document.querySelector(".app");
    if (offsetHeight / offsetWidth > 1.5) {
      style.setProperty("--pixel", `${offsetWidth / 128}px`);
      appStyle = undefined;
    } else {
      style.setProperty("--pixel", `${offsetHeight / 192}px`);
      appStyle = getNewAppStyle();
    }
  };

  onMount(updateAppStyle);

  onresize = updateAppStyle;

  // DELME
  onkeydown = ({ key }) => {
    if (key === "1") energy.set(10);
    else if (key === "0") energy.set(100);
    else if (key === "ArrowRight") energy.set($energy + 1);
    else if (key === "ArrowLeft") energy.set($energy - 1);
  };
</script>

<style>
  .app {
    height: 100%;
  }
</style>

<div class="app" style={appStyle}>
  <Game />
  {#if $overlay}
    <Overlay>
      {#if $phase === 'gameover'}
        <GameOver />
      {:else}
        <Menu />
      {/if}
    </Overlay>
  {/if}
</div>
