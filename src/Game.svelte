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
    border: 0 none;
    box-shadow: inset var(--shadow-1);
    flex-basis: var(--pixel-37);
    margin: 0;
    text-shadow: var(--shadow-1);
    width: 100%;
  }
</style>

<div class="game content" class:blur={$overlay === true}>
  <button class="digifall" on:click={openOverlay}>work in progress</button>
  <Score />
  <Board />
  <Energy />
</div>
