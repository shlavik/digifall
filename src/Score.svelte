<script>
  import { log, phase, score } from "./stores.js";
  import { getBufferDiff, getDiffTime } from "./utils.js";

  score.subscribe(({ buffer, value }) => {
    if ($phase !== "score") return;
    const diff = getBufferDiff(buffer);
    const ms = getDiffTime(diff);
    setTimeout(() => {
      if (buffer === 0) {
        log.set([]);
        phase.set("idle");
      }
      score.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    }, ms);
  });
</script>

<span class="score">{$score.value}</span>
