<script>
  import { blur } from "svelte/transition";
  import { leaderboard, score } from "./stores.js";

  let mode = "score";
  let timeoutId;
  let visible = false;

  const resetMode = () => {
    mode = "score";
    visible = false;
  };

  const scoreClick = () => {
    mode =
      mode === "score"
        ? "hi-score"
        : mode === "hi-score"
        ? "hi-total"
        : "score";
    visible = true;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(resetMode, 3000);
  };

  $: value = (() => {
    if (mode === "score") return $score.value;
    const { local: { hiTotal = {}, hiScore = {} } = {} } = $leaderboard;
    return Object.keys(mode === "hi-score" ? hiScore : hiTotal)[0] || 0;
  })();
</script>

{#key mode}
  <span class="score" in:blur on:click={scoreClick}>
    <span class="mode" class:visible>{mode}:</span>
    <span class="value">{value}</span>
  </span>
{/key}
