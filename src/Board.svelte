<script>
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
  import Card from "./Card.svelte";

  const getTargetDataIndex = ({ dataset, parentNode }) => {
    if (dataset && dataset.index) return dataset.index;
    if (parentNode) return getTargetDataIndex(parentNode);
  };

  const boardClick = (event) => {
    if ($phase !== "idle" || $plusIndex !== undefined) return;
    const index = getTargetDataIndex(event.target);
    if (index === undefined) return;
    $plusIndex = Number(index);
    const movesArray = Array.isArray($moves)
      ? $moves
      : getArrayFromBase64($moves);
    $moves = getBase64FromArray(movesArray.concat($plusIndex));
    $energy = { ...$energy, buffer: -10 };
    if ($options.transitions) setTimeout(() => ($phase = "plus"), 400);
    else $phase = "plus";
  };
</script>

<div
  class="board"
  class:overflow-hidden={$phase !== 'idle'}
  on:click={boardClick}>
  {#each $cards as card, index}
    <Card
      clickable={$phase === 'idle' && !$plusIndex}
      fallPhase={$phase === 'fall'}
      matched={$matchedIndexes.includes(index)}
      plused={$plusIndex === index}
      {...card}
      {index} />
  {/each}
</div>
