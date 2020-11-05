<script>
  import Card from "./Card.svelte";

  import { PHASE_FALL, PHASE_IDLE, PHASE_PLUS } from "./consts.js";
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

  const getTargetDataIndex = ({ dataset, parentNode }) => {
    if (dataset && dataset.index) return dataset.index;
    if (parentNode) return getTargetDataIndex(parentNode);
  };

  const boardClick = (event) => {
    if ($phase !== PHASE_IDLE || $plusIndex !== undefined) return;
    const index = getTargetDataIndex(event.target);
    if (index === undefined) return;
    $plusIndex = Number(index);
    const movesArray = Array.isArray($moves)
      ? $moves
      : getArrayFromBase64($moves);
    $moves = getBase64FromArray(movesArray.concat($plusIndex));
    $energy = { ...$energy, buffer: -10 };
    if ($options.transitions) setTimeout(() => ($phase = PHASE_PLUS), 400);
    else $phase = PHASE_PLUS;
  };
</script>

<div
  class="board"
  class:overflow-hidden={$phase !== PHASE_IDLE}
  on:click={boardClick}>
  {#each $cards as card, index}
    <Card
      clickable={$phase === PHASE_IDLE && !$plusIndex}
      fallPhase={$phase === PHASE_FALL}
      matched={$matchedIndexes.includes(index)}
      plused={$plusIndex === index}
      {...card}
      {index} />
  {/each}
</div>
