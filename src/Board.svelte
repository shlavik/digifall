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
    if (progress) return;
    $plusIndex = Number(card.dataset.index);
  }

  function click(event) {
    if (!speedrun) return;
    const card = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (!card) return;
    setPlusIndex(card);
  }

  function longpress(event) {
    if (speedrun) return;
    setPlusIndex(event.target);
  }

  /**
   * Prevent longpress action on Card
   */
  function checkStart() {
    return !speedrun && !progress;
  }

  $: ({ speedrun } = $options);
  $: idle = $phase === PHASES.idle;
  $: blink = $matchedIndexes.size > 0 && $log.length === 1;
  $: overflow = !idle && !blink;
  $: progress = !idle || $plusIndex !== undefined;
  $: plusCard = $cards[$plusIndex];
  $: plusCardMemoized = plusCard || plusCardMemoized;
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="board"
  class:overflow
  class:progress
  on:click={click}
  on:longpress={longpress}
>
  {#each $cards as card, index}
    <Card
      {card}
      {index}
      blink={$matchedIndexes.has(index)}
      plus={$plusIndex === index}
      {checkStart}
    />
  {/each}
  <div class="slider top" class:blink style={sliderStyles.horizontal} />
  <div class="slider right" class:blink style={sliderStyles.vertical} />
  <div class="slider bottom" class:blink style={sliderStyles.horizontal} />
  <div class="slider left" class:blink style={sliderStyles.vertical} />
</div>
