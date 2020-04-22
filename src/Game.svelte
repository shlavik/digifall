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
    background-color: hsl(60, 20%, 60%);
    box-shadow: var(--minus-pixel) 0 0 0 hsl(60, 20%, 60%),
      var(--pixel) 0 0 0 hsl(60, 20%, 60%),
      0 0 var(--pixel-21) var(--pixel-1) black;
  }
  .digifall,
  .digifall:focus,
  .digifall:hover {
    background-color: hsl(60, 20%, 25%);
    border: 0 none;
    box-shadow: var(--inner-shadow-1);
    color: hsl(60, 20%, 40%);
    flex-basis: var(--pixel-37);
    height: 100%;
    margin: 0;
    outline: 0 none;
    position: relative;
    text-shadow: var(--shadow-1);
    transition: all 400ms;
    width: 100%;
  }
  .digifall:active,
  .screen,
  .screen:focus,
  .screen:hover {
    background-color: hsl(60, 20%, 25%);
    color: hsl(60, 20%, 25%);
    text-shadow: var(--shadow-0);
  }
</style>

<div class="game content" class:blur={$overlay === true}>
  <button class="digifall" class:screen={$log.length} on:click={openOverlay}>
    <span>work in progress</span>
    <Log />
  </button>
  <Score />
  <Board />
  <Energy />
</div>
