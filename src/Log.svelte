<script>
  import { fade, slide } from "svelte/transition";

  import { PHASES } from "./constants.js";
  import { checkTransition } from "./core.js";
  import game, { log, phase, randomColor, score } from "./stores.js";

  $: style = `color: ${$randomColor}`;
</script>

{#if $log.length > 0}
  <ol class="log">
    {#if $phase !== PHASES.score}
      {#each $log as { extra, sum, ...row }, logIndex}
        <li
          class="row"
          in:slide={checkTransition(game, { duration: 100 })}
          out:fade={checkTransition(game, { duration: 200 })}
        >
          {#each [Object.keys(row)] as rowKeys}
            {#each rowKeys as key, rowIndex}
              <span class="value color-{key}">{row[key]}</span>
              {#if rowIndex < rowKeys.length - 1}
                <span class="plus">+</span>
              {/if}
            {/each}
          {/each}
          {#if extra === undefined}
            <span class="sum">{(logIndex + 1) * sum}</span>
          {:else}
            <span class="extra" {style}>{extra}</span>
            <span class="sum">{(logIndex + 1) * extra}</span>
          {/if}
        </li>
      {/each}
    {/if}
    {#if $phase === PHASES.combo || $phase === PHASES.score}
      {#each [$log.length === 1] as collapse}
        <li
          class:collapse
          in:slide={checkTransition(game, { duration: collapse ? 0 : 100 })}
          out:fade={checkTransition(game, { duration: 200 })}
        >
          {#if $phase === PHASES.combo}
            <span out:fade={checkTransition(game, { duration: 200 })}>
              {collapse ? "" : "combo:"}
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
