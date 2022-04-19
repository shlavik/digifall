<script>
  import { blur, fly } from "svelte/transition";

  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  import { KEYS } from "./constants.js";
  import game, {
    energy,
    overlay,
    records,
    resetGame,
    score,
  } from "./stores.js";

  function startNewGame() {
    $overlay = null;
    resetGame();
  }

  $: energyOut = $energy.value === 0;
  $: gameOver = energyOut && $energy.buffer === 0;
  $: highCombo = $records[KEYS.highCombo][KEYS.value];
  $: newRecordHighCombo = gameOver && highCombo > game[KEYS.previousHighCombo];
  $: newRecordHighScore = gameOver && $score.value > game[KEYS.previousHighScore];
  $: newRecord = newRecordHighCombo || newRecordHighScore;
</script>

<div
  class="game-over content"
  class:new-record={newRecord}
  in:blur={{ delay: 200 }}
>
  <div class="section-1">
    {#if gameOver}
      <span class="big" in:blur={{ delay: 600 }}>
        {newRecord ? "new record!" : "game over"}
      </span>
    {/if}
  </div>
  <div class="section-2">
    <Score {newRecordHighCombo} {newRecordHighScore} {newRecord} overlaid />
  </div>
  <div class="section-3">
    {#if gameOver}
      <div class="col" in:blur={{ delay: 600 }}>
        <button on:click={startNewGame}>new game</button>
      </div>
    {/if}
  </div>
  <div class="section-4">
    <Energy />
    {#if energyOut}
      <span class="energy-out">
        {#each "ut of energy" as letter, index}
          <span
            class="letter"
            in:fly={{ delay: index * 50, duration: 200, y: 50 }}
          >
            {letter}
          </span>
        {/each}
      </span>
    {/if}
  </div>
</div>
