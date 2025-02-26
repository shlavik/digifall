<script>
  import { fade, slide } from "svelte/transition";

  import { PHASES } from "./constants.js";
  import { checkRapid, combos, log, phase, score } from "./stores.js";

  function getCountsStyle(digits = []) {
    let { length } = digits;
    if (length < 1) return "";
    if (length > 4) length = 4;
    return digits.reduce(
      (result, digit, index) => {
        return result + `--clr-${index + 1}: var(--color-${digit});`;
      },
      `animation: colors-${length} ${
        200 + 200 * length
      }ms steps(2, end) infinite;`,
    );
  }
</script>

<ol class="log">
  {#if $phase !== PHASES.score}
    {#each $log as { digits, counts, extra, sum, ...row }, logIndex}
      {@const rowKeys = Object.keys(row)}
      <li
        class="row"
        in:slide={checkRapid({ duration: 100 })}
        out:fade={checkRapid({ duration: 200 })}
      >
        <span>{logIndex + 1}</span>
        <span>[</span>
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
      in:slide={checkRapid({ duration: collapse ? 0 : 100 })}
      out:fade={checkRapid({ duration: 200 })}
    >
      {#if $phase === PHASES.combo}
        <span out:fade={checkRapid({ duration: 200 })}>
          {collapse ? "" : "combo:"}
        </span>
      {/if}
      <span class="sum">
        {$phase === PHASES.score && $score.buffer > 0 ? "+" : ""}{$score.buffer}
      </span>
    </li>
  {/if}
  {#each $combos as { combo, key } (key)}
    <span class="combo">+{combo}</span>
  {/each}
</ol>

<style>
  .log {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 1rem 4rem;
    margin: 0;
    color: white;
    font-size: 5rem;
    letter-spacing: 1rem;
    line-height: 7rem;
    list-style-type: none;
    text-indent: 1rem;
    text-shadow: var(--gloss), var(--shadow-1);
  }

  .log li {
    display: flex;
    width: 100%;
    height: 7rem;
  }

  .log .combo {
    align-self: flex-end;
  }

  .log .extra {
    color: var(--color-random);
  }

  .log .sum {
    flex: 1;
    text-align: right;
  }

  .log .collapse {
    margin-top: -7rem;
  }
</style>
