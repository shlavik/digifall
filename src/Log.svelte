<script>
  import { log, phase, score } from "./stores.js";

  phase.subscribe(() => {
    if ($phase === "total")
      score.set({
        ...$score,
        buffer: $log.reduce(
          (result, { sum }, index) => result + (index + 1) * sum,
          0
        ),
      });
  });
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
  .log li::before {
    content: counter(num) "[";
    counter-increment: num;
  }
  .log li::after {
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

{#if $log.length}
  <ol class="log">
    {#each $log as { sum, ...combo }, index1}
      <li>
        {#each Object.entries(combo) as [key, value], index2}
          <span class="value color-{key}">{value}</span>
          {#if index2 < Object.keys(combo).length - 1}
            <span class="plus">+</span>
          {/if}
        {/each}
        <span class="sum">{(index1 + 1) * sum}</span>
      </li>
    {/each}
  </ol>
{/if}
