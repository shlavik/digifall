<script>
  import { options, score } from "./stores.js";

  const scoreClick = () =>
    ($options = { ...$options, scoreLabel: !$options.scoreLabel });
</script>

<span class="score" on:click={scoreClick}>
  {#if $options.scoreLabel}score:{/if}
  <span class="value">{$score.value}</span>
</span>
