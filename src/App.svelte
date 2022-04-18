<script>
  import { fade } from "svelte/transition";

  import Game from "./Game.svelte";
  import GameOver from "./GameOver.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import Menu from "./Menu.svelte";
  import Options from "./Options.svelte";
  import Wellcome from "./Wellcome.svelte";

  import { COLORS, OVERLAYS, PHASES } from "./constants.js";
  import { energy, options, overlay, phase, randomColor } from "./stores.js";

  onstorage = function syncTabs() {
    if (document.hasFocus()) return;
    document.location = document.location;
  };

  function updatePixelSize() {
    const { style, offsetHeight, offsetWidth } = document.documentElement;
    const ratio = offsetHeight / offsetWidth;
    const landscape = ratio < 1.5;
    const size = landscape ? offsetHeight / 192 : offsetWidth / 128;
    style.setProperty("--pixel", size + "px");
    $options.landscape = landscape;
  }

  updatePixelSize();
  onresize = updatePixelSize;

  function updateRandomColor() {
    if ($phase === PHASES.idle) return ($randomColor = COLORS.white);
    const hue = Math.trunc(360 * Math.random());
    $randomColor = `hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(updateRandomColor);
  }

  energy.subscribe(({ value }) => {
    if (value > 0 && value < 101) return;
    if ($randomColor !== COLORS.white) return;
    updateRandomColor();
  });

  $: document.documentElement.style.setProperty("--color-random", $randomColor);
  // $: document.head
  //   .querySelector("meta[name='theme-color']")
  //   .setAttribute("content", $overlay ? "#fff" : "#ff0");
  $: if ($phase === PHASES.gameover) $overlay = OVERLAYS.gameover;
</script>

<div class="app">
  <Game />
  {#if $overlay}
    <div class="overlay" transition:fade={{ duration: 200 }}>
      {#if $overlay === OVERLAYS.gameover}
        <GameOver />
      {:else if $overlay === OVERLAYS.leaderboard}
        <Leaderboard />
      {:else if $overlay === OVERLAYS.menu}
        <Menu />
      {:else if $overlay === OVERLAYS.options}
        <Options />
      {:else if $overlay === OVERLAYS.wellcome}
        <Wellcome />
      {/if}
    </div>
  {/if}
</div>
