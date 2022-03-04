<script>
  import { blur } from "svelte/transition";

  import { KEYS, PHASES, STRINGS } from "./constants.js";
  import { checkTransition, phase, records, score } from "./stores.js";

  export let style;
  export let newRecordHighCombo = false;
  export let newRecordHighScore = false;
  export let newRecord = false;
  export let overlaid = false;

  let key = KEYS.score;
  let timeoutId;
  let visible = false;

  function resetScoreMode() {
    key = KEYS.score;
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
    key = getKeyRoute()[key];
    visible = true;
    clearTimeout(timeoutId);
    if (newRecord) return;
    timeoutId = setTimeout(resetScoreMode, 3200);
  }

  $: if (newRecord) {
    key = newRecordHighScore ? KEYS.highScore : KEYS.highCombo;
    visible = true;
  }
  $: value = key === KEYS.score ? $score.value : $records[key][KEYS.value];
</script>

{#key key}
  <span
    class="score"
    {style}
    in:blur={checkTransition({ duration: 400 })}
    on:click={nextScore}
  >
    <span class="key" class:visible>{STRINGS[key]}:</span>
    {#if overlaid || $phase !== PHASES.gameover}
      <span class="value">{value}</span>
    {/if}
  </span>
{/key}
