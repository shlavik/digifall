<script>
  import { initGame, score } from "./stores.js";

  const newGameClick = () => initGame();
</script>

<div class="game-over content">
  <div class="section-1">
    <span class="text-big">game over</span>
  </div>
  <div class="section-2">
    <span class="score">{$score}</span>
  </div>
  <div class="section-3">
    <button on:click={newGameClick}>new game</button>
  </div>
  <div class="section-4">
    <span class="width-100">
      <span class="text-big">0</span><span class="text-small">ut of energy</span>
    </span>
  </div>
</div>
