<script>
  import { blur } from "svelte/transition";

  import { KEY_HIGH_SCORE, KEY_HIGH_TOTAL, KEY_LOCAL, KEY_SCORE } from "./consts.js";
  import { leaderboard, score } from "./stores.js";

  let key = KEY_SCORE;
  let timeoutId;
  let visible = false;

  const resetMode = () => {
    key = KEY_SCORE;
    visible = false;
  };

  const scoreClick = () => {
    key =
      key === KEY_SCORE
        ? KEY_HIGH_SCORE
        : key === KEY_HIGH_SCORE
        ? KEY_HIGH_TOTAL
        : KEY_SCORE;
    visible = true;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(resetMode, 3000);
  };

  $: value = (() => {
    if (key === KEY_SCORE) return $score.value;
    return Object.keys($leaderboard[KEY_LOCAL][key] || {})[0] || 0;
  })();
</script>

{#key key}
  <span class="score" in:blur on:click={scoreClick}>
    <span class="key" class:visible>{key}:</span>
    <span class="value">{value}</span>
  </span>
{/key}
