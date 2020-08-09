<script>
  import { onMount } from "svelte";
  import { log, overlay, seed } from "./stores.js";
  import { getNewGameBackground, setShadow } from "./utils.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";
  import Log from "./Log.svelte";

  let gameBackground = getNewGameBackground();

  const updateGameBackground = () => {
    const { style } = document.documentElement;
    const { offsetHeight, offsetWidth } = document.querySelector(".game");
    if (offsetHeight / offsetWidth > 1.5) {
      style.setProperty("--pixel", `${offsetWidth / 128}px`);
      gameBackground = undefined;
    } else {
      style.setProperty("--pixel", `${offsetHeight / 192}px`);
      gameBackground = getNewGameBackground();
    }
  };

  onMount(() => {
    updateGameBackground();
    setShadow();
  });

  onresize = updateGameBackground;

  $: console.log($seed);

  const openOverlay = () => ($overlay = true);
</script>

<div class="game" class:blur={$overlay === true} style={gameBackground}>
  <div class="content">
    <div class="section-1">
      <button
        class="digifall"
        class:screen={$log.length > 0}
        on:click={openOverlay}>
        <span>work in progress</span>
        <Log />
      </button>
    </div>
    <div class="section-2">
      <Score />
    </div>
    <div class="section-3">
      <Board />
    </div>
    <div class="section-4">
      <Energy />
    </div>
  </div>
</div>
