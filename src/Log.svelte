<script>
  import { fade, slide } from "svelte/transition";
  import { log, options, phase, randomColor, score } from "./stores.js";

  $: collapse = $log.length === 1;
</script>

{#if $log.length > 0}
  <ol class="log">
    {#if $phase !== 'score'}
      {#each $log as { extra, sum, ...combo }, index1}
        <li
          class="combo"
          in:slide={{ duration: $options.delay || 100 }}
          out:fade={{ duration: $options.delay || 200 }}>
          {#each Object.entries(combo) as [key, value], index2}
            <span class="value color-{key}">{value}</span>
            {#if index2 < Object.keys(combo).length - 1}
              <span class="plus">+</span>
            {/if}
          {/each}
          {#if extra !== undefined}
            <span class="extra" style={`color: ${$randomColor}`}>{extra}</span>
            <span class="sum">{(index1 + 1) * extra}</span>
          {:else}
            <span class="sum">{(index1 + 1) * sum}</span>
          {/if}
        </li>
      {/each}
    {/if}
    {#if $phase === 'total' || $phase === 'score'}
      <li
        class:collapse
        in:slide={{ duration: $options.delay || collapse ? 0 : 100 }}
        out:fade={{ duration: $options.delay || 200 }}>
        {#if $phase !== 'score'}
          <span out:fade={{ duration: $options.delay || 200 }}>
            {collapse ? '' : 'total:'}
          </span>
        {/if}
        <span class="sum">
          {`${$phase === 'score' && $score.buffer > 0 ? '+' : ''}${$score.buffer}`}
        </span>
      </li>
    {/if}
  </ol>
{/if}
