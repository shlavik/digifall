<script>
  import { log, phase, score } from "./stores.js";
  import { getDiffFromBuffer, getTimeFromDiff } from "./utils.js";

  score.subscribe(({ buffer, value }) => {
    if ($phase !== "score") return;
    const diff = getDiffFromBuffer(buffer);
    const ms = getTimeFromDiff(diff);
    setTimeout(() => {
      if ($phase !== "score") return;
      if (buffer === 0) {
        $log = [];
        $phase = "idle";
        return;
      }
      $score = {
        buffer: buffer - diff,
        value: value + diff,
      };
    }, ms);
  });
</script>

<span class="score">{$score.value}</span>
