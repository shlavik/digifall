<script>
  import { fade, slide } from "svelte/transition";

  import { PHASES } from "./constants.js";
  import { checkSpeedrun, log, phase, score } from "./stores.js";

  function getCountsStyle(digits = []) {
    let { length } = digits;
    if (length < 1) return "";
    if (length > 4) length = 4;
    return digits.reduce((result, digit, index) => {
      return result + `--clr-${index + 1}: var(--color-${digit});`;
    }, `animation: colors-${length} ${200 + 200 * length}ms steps(2, end) infinite;`);
  }
</script>

<ol class="log">
  {#if $phase !== PHASES.score}
    {#each $log as { digits, counts, extra, sum, ...row }, logIndex}
      {@const rowKeys = Object.keys(row)}
      <li
        class="row"
        in:slide={checkSpeedrun({ duration: 100 })}
        out:fade={checkSpeedrun({ duration: 200 })}
      >
        <span>{logIndex + 1}[</span>
        {#each rowKeys as key, rowIndex}
          <span class="value" style:color="var(--color-{key})">{row[key]}</span>
          {#if rowIndex < rowKeys.length - 1}
            <span class="plus">+</span>
          {/if}
        {/each}
        {#if extra === undefined}
          <span>]</span>
          {#if counts > 1}
            <span class="counts" style={getCountsStyle(digits)}>{counts}</span>
          {/if}
          <span>=</span>
          <span class="sum">{(logIndex + 1) * sum * counts}</span>
        {:else}
          <span class="extra">{extra}</span>
          <span>]=</span>
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
