<script>
  import Card from "./Card.svelte";

  import { getArrayFromBase64, getBase64FromArray } from "./core.js";
  import { PHASES } from "./constants.js";
  import {
    cards,
    energy,
    log,
    matchedIndexes,
    moves,
    options,
    phase,
    plusIndex,
  } from "./stores.js";

  function boardClick(event) {
    if ($phase !== PHASES.idle || $plusIndex !== undefined) return;
    const block = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (block === undefined) return;
    $plusIndex = Number(block.dataset.index);
    const movesArray = Array.isArray($moves)
      ? $moves
      : getArrayFromBase64($moves);
    $moves = getBase64FromArray(movesArray.concat($plusIndex));
    $energy = { ...$energy, buffer: -10 };
    if ($options.transitions) setTimeout(() => ($phase = PHASES.plus), 400);
    else $phase = PHASES.plus;
  }

  $: plusCard = $cards[$plusIndex];
  $: plusCardMemoized = plusCard || plusCardMemoized;
  $: blink = $matchedIndexes.length > 0 && $log.length === 1;
  $: overflow = $phase !== PHASES.idle && !blink;
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

<div class="board" class:overflow on:click={boardClick}>
  {#each $cards as card, index}
    <Card
      clickable={$phase === PHASES.idle && !$plusIndex}
      fallPhase={$phase === PHASES.fall}
      matched={$matchedIndexes.includes(index)}
      plused={$plusIndex === index}
      {...card}
      {index}
    />
  {/each}
  <div class="slider top" class:blink style={sliderStyles.horizontal} />
  <div class="slider right" class:blink style={sliderStyles.vertical} />
  <div class="slider bottom" class:blink style={sliderStyles.horizontal} />
  <div class="slider left" class:blink style={sliderStyles.vertical} />
</div>
