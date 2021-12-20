<script>
  import { blur, fly } from "svelte/transition";

  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  import { KEYS } from "./constants";
  import { checkTransition, resetGame } from "./core.js";
  import game, { energy, leaderboard, randomColor, score } from "./stores.js";

  function startNewGame() {
    resetGame(game, false);
  }

  $: energyOut = $energy.value === 0;
  $: gameOver = energyOut && $energy.buffer === 0;
  $: highCombo = Number(
    Object.keys($leaderboard[KEYS.local][KEYS.highCombo] || {})[0] || 0
  );
  $: newRecordHighCombo = gameOver && highCombo > game.previousHighCombo;
  $: newRecordHighScore = gameOver && $score.value > game.previousHighScore;
  $: newRecord = newRecordHighCombo || newRecordHighScore;
  $: style = newRecord ? `color: ${$randomColor}` : undefined;
</script>

<div class="game-over content" in:blur={checkTransition(game, { delay: 200 })}>
  <div class="section-1">
    {#if gameOver}
      <span class="big" {style} in:blur={checkTransition(game, { delay: 600 })}>
        {newRecord ? "new record" : "game over"}
      </span>
    {/if}
  </div>
  <div class="section-2">
    <Score
      {style}
      {newRecordHighCombo}
      {newRecordHighScore}
      {newRecord}
      overlaid
    />
  </div>
  <div class="section-3">
    {#if gameOver}
      <div class="col" in:blur={checkTransition(game, { delay: 600 })}>
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
            in:fly={checkTransition(game, {
              delay: index * 50,
              duration: 200,
              y: 50,
            })}
          >
            {letter}
          </span>
        {/each}
      </span>
    {/if}
  </div>
</div>
