<script>
  import { blur, slide } from "svelte/transition";
  import { energy, options, initGame } from "./stores.js";
  import Energy from "./Energy.svelte";
  import Score from "./Score.svelte";

  $: isEnergyOut = $energy.buffer === 0 && $energy.value === 0;
</script>

<div
  class="game-over content"
  in:blur={{ delay: $options.transitions ? 200 : 0 }}>
  <div class="section-1">
    {#if isEnergyOut}
      <span
        class="text-big"
        in:blur={{ delay: $options.transitions ? 600 : 0 }}>game over</span>
    {/if}
  </div>
  <div class="section-2">
    <Score />
  </div>
  <div class="section-3">
    {#if isEnergyOut}
      <div class="col" in:blur={{ delay: $options.transitions ? 600 : 0 }}>
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
            in:slide={$options.transitions ? { delay: index * 50, duration: 200 } : { delay: 0, duration: 0 }}>
            {letter}
          </span>
        {/each}
      </span>
    {/if}
  </div>
</div>
