<script>
  import { blur, fly } from "svelte/transition";
  import { energy, initGame } from "./stores.js";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  $: isEnergyOut = $energy.buffer === 0 && $energy.value === 0;
</script>

<div class="game-over content" in:blur>
  <div class="section-1">
    {#if isEnergyOut}
      <span class="text-big" in:blur={{ delay: 600 }}>game over</span>
    {/if}
  </div>
  <div class="section-2">
    <Score />
  </div>
  <div class="section-3">
    {#if isEnergyOut}
      <div class="col" in:blur={{ delay: 600 }}>
        <button on:click={initGame}>new game</button>
      </div>
    {/if}
  </div>
  <div class="section-4">
    <Energy />
    {#if $energy.value === 0}
      <span class="energy-out">
        {#each 'ut of energy' as letter, index}
          <span
            class="letter"
            in:fly={{ delay: index * 50, duration: 200, y: 100 }}>
            {letter}
          </span>
        {/each}
      </span>
    {/if}
  </div>
</div>
