<script>
  import { blur } from "svelte/transition";
  import { initGame, score } from "./stores.js";

  const newGameClick = () => initGame();
</script>

<div class="game-over content">
  <div class="section-1">
    <span class="text-big" in:blur>game over</span>
  </div>
  <div class="section-2">
    <span class="score">{$score.value}</span>
  </div>
  <div class="section-3">
    <div class="col" in:blur>
      <button on:click={newGameClick}>new game</button>
    </div>
  </div>
  <div class="section-4">
    <span class="text-wrapper" in:blur>
      <span class="text-big">0</span>
      <span class="text-small">ut of energy</span>
    </span>
  </div>
</div>
