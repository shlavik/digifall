<script>
  import { blur, fly } from "svelte/transition";

  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  import { energy, options, initGame } from "./stores.js";

  function startNewGame() {
    initGame(false);
  }

  $: gameOver = $energy.buffer === 0 && $energy.value === 0;
</script>

<div
  class="game-over content"
  in:blur={{ delay: $options.transitions ? 200 : 0 }}
>
  <div class="section-1">
    {#if gameOver}
      <span class="big" in:blur={{ delay: $options.transitions ? 600 : 0 }}>
        game over
      </span>
    {/if}
  </div>
  <div class="section-2">
    <Score />
  </div>
  <div class="section-3">
    {#if gameOver}
      <div class="col" in:blur={{ delay: $options.transitions ? 600 : 0 }}>
        <button on:click={startNewGame}>new game</button>
      </div>
    {/if}
  </div>
  <div class="section-4">
    <Energy />
    {#if $energy.value === 0}
      <span class="energy-out">
        {#each "ut of energy" as letter, index}
          <span
            class="letter"
            in:fly={$options.transitions
              ? { delay: index * 50, duration: 200, y: 50 }
              : undefined}
          >
            {letter}
          </span>
        {/each}
      </span>
    {/if}
  </div>
</div>
