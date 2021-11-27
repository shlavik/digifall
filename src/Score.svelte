<script>
  import { blur } from "svelte/transition";

  import { KEYS } from "./constants.js";
  import { checkTransition } from "./core.js";
  import { leaderboard, score } from "./stores.js";

  let key = KEYS.score;
  let timeoutId;
  let visible = false;

  function resetMode() {
    key = KEYS.score;
    visible = false;
  }

  function nextScore() {
    key = {
      [KEYS.score]: KEYS.highScore,
      [KEYS.highScore]: KEYS.highTotal,
      [KEYS.highTotal]: KEYS.score,
    }[key];
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
  <span
    class="score"
    in:blur={checkTransition({ duration: 600 })}
    on:click={nextScore}
  >
    <span class="key" class:visible>{key}:</span>
    <span class="value">{value}</span>
  </span>
{/key}
