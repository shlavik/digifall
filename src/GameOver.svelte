<script>
  const handleRestartClick = () => location.reload(true);
</script>

<style>
  .game-over {
    align-items: center;
    color: white;
  }
</style>

<div class="game-over content">
  <span>game over</span>
  <button on:click={handleRestartClick}>Restart</button>
</div>
