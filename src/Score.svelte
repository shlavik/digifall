<script>
  import { blur } from "svelte/transition";

  import { KEYS } from "./constants.js";
  import { leaderboard, score } from "./stores.js";

  let key = KEYS.score;
  let timeoutId;
  let visible = false;

  function resetMode() {
    key = KEYS.score;
    visible = false;
  }

  function scoreClick() {
    key =
      key === KEYS.score
        ? KEYS.highScore
        : key === KEYS.highScore
        ? KEYS.highTotal
        : KEYS.score;
    visible = true;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(resetMode, 3000);
  }

  $: value =
    key === KEYS.score
      ? $score.value
      : Object.keys($leaderboard[KEYS.local][key] || {})[0] || 0;
</script>

{#key key}
  <span class="score" in:blur on:click={scoreClick}>
    <span class="key" class:visible>{key}:</span>
    <span class="value">{value}</span>
  </span>
{/key}
