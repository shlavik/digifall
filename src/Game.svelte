<script>
  import { phase, energy } from "./stores.js";
  import Score from "./Score.svelte";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";

  $: {
    if ($phase === "match" && $energy < 10) alert("GAME OVER");
  }
</script>

<div class="game">
  <button class="btn waves-effect waves-light digifall">Digifall</button>
  <Score />
  <Board />
  <Energy />
</div>
