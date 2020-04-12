<script>
  const handleRestartClick = () => location.reload();
</script>

<style>
  .game-over {
    align-items: center;
    color: white;
  }
</style>

<div class="game-over content">
  game over
  <button on:click={handleRestartClick}>Restart</button>
</div>
