<script>
  import { fade, slide } from "svelte/transition";

  import { PHASES } from "./constants.js";
  import { checkSpeedrun, log, phase, score } from "./stores.js";
</script>

<ol class="log">
  {#if $phase !== PHASES.score}
    {#each $log as { extra, sum, ...row }, logIndex}
      {@const rowKeys = Object.keys(row)}
      <li
        class="row"
        in:slide={checkSpeedrun({ duration: 100 })}
        out:fade={checkSpeedrun({ duration: 200 })}
      >
        {#each rowKeys as key, rowIndex}
          <span class="value color-{key}">{row[key]}</span>
          {#if rowIndex < rowKeys.length - 1}
            <span class="plus">+</span>
          {/if}
        {/each}
        {#if extra === undefined}
          <span class="sum">{(logIndex + 1) * sum}</span>
        {:else}
          <span class="extra">{extra}</span>
          <span class="sum">{(logIndex + 1) * extra}</span>
        {/if}
      </li>
    {/each}
  {/if}
  {#if $phase === PHASES.combo || $phase === PHASES.score}
    {@const collapse = $log.length === 1}
    <li
      class:collapse
      in:slide={checkSpeedrun({ duration: collapse ? 0 : 100 })}
      out:fade={checkSpeedrun({ duration: 200 })}
    >
      {#if $phase === PHASES.combo}
        <span out:fade={checkSpeedrun({ duration: 200 })}>
          {collapse ? "" : "combo:"}
        </span>
      {/if}
      <span class="sum">
        {$phase === PHASES.score && $score.buffer > 0 ? "+" : ""}{$score.buffer}
      </span>
    </li>
  {/if}
</ol>
