<script>
  import { energy, log, phase, score } from "./stores.js";
  import { getBufferDiff } from "./utils.js";

  score.subscribe(({ buffer, value }) => {
    if (buffer !== 0) {
      requestAnimationFrame(() => {
        const diff = getBufferDiff(buffer);
        score.set({
          buffer: buffer - diff,
          value: value + diff,
        });
      });
    } else {
      if ($energy.value > 100) energy.set({ buffer: 0, value: 100 });
      log.set([]);
      phase.set("idle");
    }
  });
</script>

<span class="score">{$score.value}</span>
