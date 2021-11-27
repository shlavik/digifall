<script>
  import { fade, slide } from "svelte/transition";

  import { PHASES } from "./constants.js";
  import { checkTransition } from "./core.js";
  import { log, phase, randomColor, score } from "./stores.js";
</script>

{#if $log.length > 0}
  <ol class="log">
    {#if $phase !== PHASES.score}
      {#each $log as { extra, sum, ...combo }, index1}
        <li
          class="combo"
          in:slide={checkTransition({ duration: 100 })}
          out:fade={checkTransition({ duration: 200 })}
        >
          {#each [Object.keys(combo)] as comboKeys}
            {#each comboKeys as key, index2}
              <span class="value color-{key}">{combo[key]}</span>
              {#if index2 < comboKeys.length - 1}
                <span class="plus">+</span>
              {/if}
            {/each}
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
    {#if $phase === PHASES.total || $phase === PHASES.score}
      {#each [$log.length === 1] as collapse}
        <li
          class:collapse
          in:slide={checkTransition({ duration: collapse ? 0 : 100 })}
          out:fade={checkTransition({ duration: 200 })}
        >
          {#if $phase === PHASES.total}
            <span out:fade={checkTransition({ duration: 200 })}>
              {collapse ? "" : "total:"}
            </span>
          {/if}
          <span class="sum">
            {$phase === PHASES.score && $score.buffer > 0
              ? "+"
              : ""}{$score.buffer}
          </span>
        </li>
      {/each}
    {/if}
  </ol>
{/if}
