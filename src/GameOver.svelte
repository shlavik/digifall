<script>
  import { initGame } from "./stores.js";

  const newGameClick = () => initGame();
</script>

<div class="game-over content">
  <span class="big-text">game over</span>
  <button on:click={newGameClick}>new game</button>
</div>
