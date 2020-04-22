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
    line-height: var(--pixel-7);
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    padding: var(--pixel) var(--pixel-4);
    position: absolute;
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
</style>

{#if $log.length}
  <ol class="log">
    {#each $log.slice(-5) as combo}
      <li>
        {#each Object.entries(combo) as [key, value], idx}
          <span class="value color-{key}">{value}</span>
          {#if idx < Object.keys(combo).length - 1}
            <span class="plus">+</span>
          {/if}
        {/each}
        <span class="sum">
          {Object.values(combo).reduce((result, value) => result + value)}
        </span>
      </li>
    {/each}
  </ol>
{/if}
