<script>
  import { fade, slide } from "svelte/transition";

  import { EMPTY_STRING, PHASE_SCORE, PHASE_TOTAL } from "./consts.js";
  import { log, phase, randomColor, score } from "./stores.js";

  $: collapse = $log.length === 1;
</script>

{#if $log.length > 0}
  <ol class="log">
    {#if $phase !== PHASE_SCORE}
      {#each $log as { extra, sum, ...combo }, index1}
        <li
          class="combo"
          in:slide={{ duration: 100 }}
          out:fade={{ duration: 200 }}>
          {#each Object.entries(combo) as [key, value], index2}
            <span class="value color-{key}">{value}</span>
            {#if index2 < Object.keys(combo).length - 1}
              <span class="plus">+</span>
            {/if}
          {/each}
          {#if extra === undefined}
            <span class="sum">{(index1 + 1) * sum}</span>
          {:else}
            <span class="extra" style={`color: ${$randomColor}`}>{extra}</span>
            <span class="sum">{(index1 + 1) * extra}</span>
          {/if}
        </li>
      {/each}
    {/if}
    {#if $phase === PHASE_TOTAL || $phase === PHASE_SCORE}
      <li
        class:collapse
        in:slide={{ duration: collapse ? 0 : 100 }}
        out:fade={{ duration: 200 }}>
        {#if $phase !== PHASE_SCORE}
          <span
            out:fade={{ duration: 200 }}>{collapse ? EMPTY_STRING : 'total:'}
          </span>
        {/if}
        <span class="sum">
          {`${$phase === PHASE_SCORE && $score.buffer > 0 ? '+' : EMPTY_STRING}${$score.buffer}`}
        </span>
      </li>
    {/if}
  </ol>
{/if}
