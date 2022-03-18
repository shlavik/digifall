<script>
  import Card from "./Card.svelte";

  import { PHASES } from "./constants.js";
  import {
    cards,
    log,
    matchedIndexes,
    options,
    phase,
    plusIndex,
  } from "./stores.js";

  function setPlusIndex(card) {
    if ($phase !== PHASES.idle || $plusIndex !== undefined) return;
    $plusIndex = Number(card.dataset.index);
  }

  function click(event) {
    if ($options.transitions) return;
    const card = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (!card) return;
    setPlusIndex(card);
  }

  function longpress(event) {
    if (!$options.transitions) return;
    setPlusIndex(event.target);
  }

  $: instant = $phase !== PHASES.fall;
  $: overflow = $phase !== PHASES.idle && !blink;
  $: progress = $phase !== PHASES.idle || $plusIndex;
  $: transitions = $options.transitions;
  $: plusCard = $cards[$plusIndex];
  $: plusCardMemoized = plusCard || plusCardMemoized;
  $: blink = $matchedIndexes.length > 0 && $log.length === 1;
  $: focus = plusCard || blink;
  $: sliderStyles = {
    horizontal: `
      left: ${focus ? plusCardMemoized.x * 21 : -1}rem;
      right: ${focus ? (5 - plusCardMemoized.x) * 21 : -1}rem;
    `,
    vertical: `
      top: ${focus ? (5 - plusCardMemoized.y) * 21 : -1}rem;
      bottom: ${focus ? plusCardMemoized.y * 21 : -1}rem;
    `,
  };
</script>

<div
  class="board"
  class:instant
  class:overflow
  class:progress
  class:transitions
  on:click={click}
  on:longpress={longpress}
>
  {#each $cards as card, index}
    <Card {blink} {card} {index} />
  {/each}
  <div class="slider top" class:blink style={sliderStyles.horizontal} />
  <div class="slider right" class:blink style={sliderStyles.vertical} />
  <div class="slider bottom" class:blink style={sliderStyles.horizontal} />
  <div class="slider left" class:blink style={sliderStyles.vertical} />
</div>
