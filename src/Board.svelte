<script>
  import Card from "./Card.svelte";

  import { PHASE_FALL, PHASE_IDLE, PHASE_PLUS } from "./constants.js";
  import {
    cards,
    energy,
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

  $: sliderStyles = {
    top: `
      left: ${plusCard ? plusCard.x * 21 : -1}rem;
      width: ${plusCard ? 21 : 128}rem;
    `,
    right: `
      bottom: ${plusCard ? plusCard.y * 21 : -1}rem;
      height: ${plusCard ? 21 : 128}rem;
    `,
    bottom: `
      left: ${plusCard ? plusCard.x * 21 : -1}rem;
      width: ${plusCard ? 21 : 128}rem;
    `,
    left: `
      bottom: ${plusCard ? plusCard.y * 21 : -1}rem;
      height: ${plusCard ? 21 : 128}rem;
    `,
  };
</script>

<div
  class="board"
  class:overflow-hidden={$phase !== PHASE_IDLE}
  on:click={boardClick}
>
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
  <div class="slider top" style={sliderStyles.top} />
  <div class="slider right" style={sliderStyles.right} />
  <div class="slider bottom" style={sliderStyles.bottom} />
  <div class="slider left" style={sliderStyles.left} />
</div>
