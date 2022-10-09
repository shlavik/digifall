<script>
  import { blur } from "svelte/transition";

  import { KEYS, PHASES } from "./constants.js";
  import { phase, records, score } from "./stores.js";

  export let newRecordHighCombo = false;
  export let newRecordHighScore = false;
  export let newRecord = false;
  export let overlaid = false;

  const types = {
    [KEYS.highCombo]: "hi-combo",
    [KEYS.highScore]: "hi-score",
    [KEYS.score]: "score",
  };

  let type = KEYS.score;
  let timeoutId;
  let visible = false;

  function resetScoreMode() {
    type = KEYS.score;
    visible = newRecord;
  }

  function getKeyRoute() {
    return newRecord
      ? {
          [KEYS.highScore]: newRecordHighCombo
            ? KEYS.highCombo
            : KEYS.highScore,
          [KEYS.highCombo]: newRecordHighScore
            ? KEYS.highScore
            : KEYS.highCombo,
        }
      : {
          [KEYS.score]: KEYS.highScore,
          [KEYS.highScore]: KEYS.highCombo,
          [KEYS.highCombo]: KEYS.score,
        };
  }

  function nextScore() {
    type = getKeyRoute()[type];
    visible = true;
    clearTimeout(timeoutId);
    if (newRecord) return;
    timeoutId = setTimeout(resetScoreMode, 3200);
  }

  $: if (newRecord) {
    type = newRecordHighScore ? KEYS.highScore : KEYS.highCombo;
    visible = true;
  }
  $: value = type === KEYS.score ? $score.value : $records[type][KEYS.value];
</script>

{#key type}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span class="score" in:blur on:click={nextScore}>
    <span class="type" class:visible>{types[type]}:</span>
    {#if overlaid || $phase !== PHASES.gameover}
      <span class="value">{value}</span>
    {/if}
  </span>
{/key}
