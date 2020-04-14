<script>
  import { overlay } from "./stores.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  const openOverlay = () => overlay.set(true);
</script>

<style>
  .game {
    background-color: hsl(60, 20%, 60%);
    box-shadow: var(--minus-pixel) 0 0 0 hsl(60, 20%, 60%),
      var(--pixel) 0 0 0 hsl(60, 20%, 60%),
      0 0 var(--pixel-21) var(--pixel-1) black;
  }
  .digifall {
    background-color: transparent;
    border: none;
    color: white;
    flex-basis: var(--pixel-37);
    font-family: font5x5;
    font-size: var(--pixel-5);
    letter-spacing: var(--pixel-5);
    line-height: 1;
    padding-left: var(--pixel-5);
  }
</style>

<div class="game content">
  <button class="digifall" on:click={openOverlay}>work in progress</button>
  <Score />
  <Board />
  <Energy />
</div>
