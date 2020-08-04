<script>
  import { log, phase, randomColor, score } from "./stores.js";
</script>

<style>
  .log {
    align-items: flex-start;
    color: white;
    counter-reset: num;
    display: flex;
    flex-direction: column;
    font-size: 5rem;
    height: 100%;
    justify-content: flex-end;
    left: 0;
    letter-spacing: 1rem;
    line-height: 7rem;
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    padding: 1rem 4rem;
    position: absolute;
    text-indent: 1rem;
    text-shadow: var(--shadow-1);
    top: 0;
    width: 100%;
  }
  .log li {
    display: flex;
  }
  .log .combo::before {
    content: counter(num) "[";
    counter-increment: num;
  }
  .log .combo::after {
    content: "]=";
  }
  .log .value {
    color: var(--color);
  }
  .log .sum {
    position: absolute;
    right: 4rem;
  }
</style>

{#if $log.length > 0}
  <ol class="log">
    {#if $phase !== 'score'}
      {#each $log as { extra, sum, ...combo }, index1}
        <li class="combo">
          {#each Object.entries(combo) as [key, value], index2}
            <span class="value color-{key}">{value}</span>
            {#if index2 < Object.keys(combo).length - 1}
              <span class="plus">+</span>
            {/if}
          {/each}
          {#if extra !== undefined}
            <span class="extra" style={`color: ${$randomColor}`}>{extra}</span>
            <span class="sum" style={`color: ${$randomColor}`}>
              {(index1 + 1) * extra}
            </span>
          {:else}
            <span class="sum">{(index1 + 1) * sum}</span>
          {/if}
        </li>
      {/each}
    {/if}
    {#if $phase === 'total' || $phase === 'score'}
      <li>
        <span>total:</span>
        <span class="sum">
          {`${$phase === 'score' && $score.buffer > 0 ? '+' : ''}${$score.buffer}`}
        </span>
      </li>
    {/if}
  </ol>
{/if}
