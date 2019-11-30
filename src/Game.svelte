<script>
  import { phase, energy } from "./stores.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";
</script>

<style>
  .game {
    background-color: dimgray;
    box-shadow: 0 0 25vh 5vh black;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-around;
    margin: auto;
    position: relative;
    width: var(--game-width);
  }
  .digifall {
    background-color: white;
    flex-basis: var(--card-size);
  }
</style>

<div class="game">
  <button class="digifall">Digifall</button>
  <Score />
  <Board />
  <Energy />
</div>
