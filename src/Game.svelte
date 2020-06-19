<script>
  import { log, overlay } from "./stores.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";
  import Log from "./Log.svelte";

  const openOverlay = () => overlay.set(true);
</script>

<style>
  .game {
    background-color: var(--color-base);
    box-shadow: -1rem 0 0 0 var(--color-base),
      1rem 0 0 0 var(--color-base),
      var(--shadow-21);
    overflow: hidden;
  }
  .digifall,
  .digifall:focus,
  .digifall:hover {
    background-color: var(--color-dark);
    border: none;
    box-shadow: var(--shadow-inset-1);
    color: var(--color-zero);
    flex-grow: 1;
    outline: none;
    position: relative;
    text-shadow: var(--shadow-1);
    transition: all 400ms;
    width: 100%;
  }
  .digifall:active,
  .screen,
  .screen:focus,
  .screen:hover {
    background-color: var(--color-dark);
    color: var(--color-dark);
    text-shadow: var(--shadow-0);
  }
</style>

<div class="game content" class:blur={$overlay === true}>
  <div class="section-1">
    <button class="digifall" class:screen={$log.length} on:click={openOverlay}>
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
