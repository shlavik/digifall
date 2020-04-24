<script>
  import { log, score } from "./stores.js";

  log.subscribe(arr => {
    const { length } = arr;
    if (length) {
      const { sum } = arr.slice(-1)[0];
      if (sum) score.set($score + length * sum);
    }
  });
</script>

<style>
  .score {
    color: white;
    font-size: var(--pixel-7);
    line-height: 1;
    padding-right: var(--pixel-4);
    text-align: right;
    width: 100%;
  }
</style>

<span class="score">{$score}</span>
