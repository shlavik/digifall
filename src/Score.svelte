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

<span class="score">{$score}</span>
