<script>
  import { log } from "./stores.js";
</script>

<style>
  .log {
    align-items: flex-start;
    color: white;
    counter-reset: num;
    display: flex;
    flex-direction: column;
    font-size: var(--pixel-5);
    height: 100%;
    justify-content: flex-end;
    left: 0;
    letter-spacing: var(--pixel);
    line-height: var(--pixel-7);
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    padding: var(--pixel) var(--pixel-4);
    position: absolute;
    text-indent: var(--pixel);
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
    right: var(--pixel-4);
  }
  .log .sum::before {
    content: "+";
  }
</style>

{#if $log.length}
  <ol class="log">
    {#each $log.slice(-5) as combo, index1}
      <li>
        {#each Object.entries(combo) as [key, value], index2}
          {#if key !== 'sum'}
            <span class="value color-{key}">{value}</span>
            {#if index2 < Object.keys(combo).length - 2}
              <span class="plus">+</span>
            {/if}
          {/if}
        {/each}
        <span class="sum">{(index1 + 1) * combo.sum}</span>
      </li>
    {/each}
  </ol>
{/if}
