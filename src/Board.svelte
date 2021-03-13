<script>
  import Card from "./Card.svelte";

  import {
    PHASE_BLINK,
    PHASE_FALL,
    PHASE_IDLE,
    PHASE_PLUS,
  } from "./constants.js";
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
  import { getArrayFromBase64, getBase64FromArray } from "./utils";

  const boardClick = (event) => {
    if ($phase !== PHASE_IDLE || $plusIndex !== undefined) return;
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
    if ($options.transitions) setTimeout(() => ($phase = PHASE_PLUS), 400);
    else $phase = PHASE_PLUS;
  };

  $: plusCard = $cards[$plusIndex];
  $: plusCardMemoized = plusCard || plusCardMemoized;
  $: blink = $matchedIndexes.length > 0 && $log.length === 1;
  $: overflow = $phase !== PHASE_IDLE && !blink;
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
      clickable={$phase === PHASE_IDLE && !$plusIndex}
      fallPhase={$phase === PHASE_FALL}
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
