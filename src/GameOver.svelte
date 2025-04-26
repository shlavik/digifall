<script>
  import { blur, fly } from "svelte/transition";

  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  import { KEYS, OVERLAYS } from "./constants.js";
  import game, {
    energy,
    options,
    overlay,
    records,
    resetGame,
    score,
  } from "./stores.js";

  export let scoreComponent;

  function startNewGame() {
    resetGame();
  }

  function showLeaderboard() {
    $overlay = OVERLAYS.leaderboard;
  }

  function showOptions() {
    $overlay = OVERLAYS.options;
  }

  $: energyOut = $energy.value === 0;
  $: gameOver = energyOut && $energy.buffer === 0;
  $: highCombo = $records[KEYS.highCombo][KEYS.value];
  $: newRecordHighCombo = gameOver && highCombo > game[KEYS.highComboPrev];
  $: newRecordHighScore = gameOver && $score.value > game[KEYS.highScorePrev];
  $: newRecord = newRecordHighCombo || newRecordHighScore;
</script>

<div class="game-over content" class:new-record={newRecord} in:blur>
  <div class="section-1">
    {#if gameOver}
      <h1 in:fly|global={{ delay: 600, y: -48 }}>
        {newRecord ? "new record!" : "game over"}
      </h1>
    {/if}
  </div>
  <div class="section-2">
    <Score
      {newRecordHighCombo}
      {newRecordHighScore}
      {newRecord}
      overlaid
      bind:this={scoreComponent}
    />
  </div>
  <div class="section-3">
    {#if gameOver}
      <div class="col" in:fly|global={{ delay: 600, y: 24 }}>
        <button on:click={startNewGame}>new game</button>
        {#if $options[KEYS.leaderboard]}
          <button on:click={showLeaderboard}>p2p leaderboard</button>
        {/if}
        <button on:click={showOptions}>options</button>
      </div>
    {/if}
  </div>
  <div class="section-4">
    <Energy {gameOver} />
  </div>
</div>

<style lang="postcss">
  :global .game-over {
    &.new-record {
      h1,
      .score {
        color: var(--color-random);
      }

      .score:active {
        text-shadow: 0 0 1px var(--color-random);
      }
    }

    .score:active {
      color: var(--color-invis-2);
      text-shadow: var(--glow);
    }

    .energy {
      background-color: transparent;
      box-shadow: none;

      .left-bar .left-value {
        color: black;
      }
    }
  }

  @keyframes scale-in {
    from {
      transform: scale(0);
    }

    to {
      transform: scale(1);
    }
  }
</style>
