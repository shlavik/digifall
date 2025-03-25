<script>
  import { blur as blurTransition } from "svelte/transition";

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
  let focused = false;

  export function isFocused() {
    return focused;
  }

  export function focus() {
    focused = true;
  }

  export function blur() {
    focused = false;
  }

  export function nextType() {
    type = getNextType(type);
    animateNewType();
  }

  export function prevType() {
    type = getNextType(type, true);
    animateNewType();
  }

  function getNextType(type, reverse = false) {
    if (newRecord)
      return {
        [KEYS.highScore]: newRecordHighCombo ? KEYS.highCombo : KEYS.highScore,
        [KEYS.highCombo]: newRecordHighScore ? KEYS.highScore : KEYS.highCombo,
      }[type];
    if (reverse)
      return {
        [KEYS.score]: KEYS.highCombo,
        [KEYS.highScore]: KEYS.score,
        [KEYS.highCombo]: KEYS.highScore,
      }[type];
    return {
      [KEYS.score]: KEYS.highScore,
      [KEYS.highScore]: KEYS.highCombo,
      [KEYS.highCombo]: KEYS.score,
    }[type];
  }

  function animateNewType() {
    visible = true;
    clearTimeout(timeoutId);
    if (newRecord) return;
    timeoutId = setTimeout(() => {
      type = KEYS.score;
      visible = newRecord;
    }, 3200);
  }

  $: if (newRecord) {
    type = newRecordHighScore ? KEYS.highScore : KEYS.highCombo;
    visible = true;
  }
  $: value = type === KEYS.score ? $score.value : $records[type][KEYS.value];
  $: title =
    "score: " +
    value +
    "\nhigh score: " +
    $records[KEYS.highScore][KEYS.value] +
    "\nhigh combo: " +
    $records[KEYS.highCombo][KEYS.value];
</script>

{#key type}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span
    class="score"
    class:focus={focused}
    {title}
    tabindex="0"
    role="button"
    in:blurTransition
    on:click|preventDefault={nextType}
  >
    <span class="type" class:visible>{types[type]}:</span>
    {#if overlaid || $phase !== PHASES.gameOver}
      <span class="value">{value}</span>
    {/if}
  </span>
{/key}

<style>
  :global .score {
    display: flex;
    align-items: baseline;
    padding: 2rem 0;
    margin: 1rem 3rem;
    cursor: pointer;
    white-space: nowrap;

    &.focus,
    &:active {
      text-shadow: var(--shadow-0);
    }

    &:active {
      color: var(--color-base);
    }

    &:not(:active).focus {
      box-shadow:
        1px 1px var(--color-dark),
        1px -1px var(--color-dark),
        -1px -1px var(--color-dark),
        -1px 1px var(--color-dark);
      outline-offset: -1px;
    }

    &.focus .type,
    &:hover .type,
    .type.visible {
      display: inline;
    }

    .type {
      display: none;
    }

    .value {
      width: 100%;
      font-size: 6.5rem;
      font-weight: bold;
      text-align: right;
    }
  }
</style>
