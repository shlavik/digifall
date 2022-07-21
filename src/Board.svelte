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
    if ($options.speedrun !== true) return;
    const card = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (!card) return;
    setPlusIndex(card);
  }

  function longpress(event) {
    if ($options.speedrun === true) return;
    setPlusIndex(event.target);
  }

  $: plusCard = $cards[$plusIndex];
  $: plusCardMemoized = plusCard || plusCardMemoized;
  $: blink = $matchedIndexes.size > 0 && $log.length === 1;
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
  class:overflow={$phase !== PHASES.idle && !blink}
  class:progress={$phase !== PHASES.idle || $plusIndex}
  class:speedrun={$options.speedrun}
  on:click={click}
  on:longpress={longpress}
>
  {#each $cards as card, index}
    <Card {card} {index} matched={$matchedIndexes.has(index)} />
  {/each}
  <div class="slider top" class:blink style={sliderStyles.horizontal} />
  <div class="slider right" class:blink style={sliderStyles.vertical} />
  <div class="slider bottom" class:blink style={sliderStyles.horizontal} />
  <div class="slider left" class:blink style={sliderStyles.vertical} />
</div>
