<script>
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  const handleFullscreenSwitch = () => {
    const { documentElement, fullscreen } = document;
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      documentElement.requestFullscreen();
    }
  };
</script>

<style>
  .game {
    background-color: hsl(60, 20%, 60%);
    box-shadow: 0 0 10vh 5vh rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-evenly;
    margin: auto;
    width: var(--game-width);
  }
  .digifall {
    background-color: white;
    flex-basis: var(--pixel-37);
  }
</style>

<div class="game">
  <button class="digifall" on:click={handleFullscreenSwitch}>Digifall</button>
  <Score />
  <Board />
  <Energy />
</div>
