<script>
  import { log, overlay } from "./stores.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";
  import Log from "./Log.svelte";

  const openOverlay = () => ($overlay = true);
</script>

<div class="game content" class:blur={$overlay === true}>
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
