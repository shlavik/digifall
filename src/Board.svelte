<script>
  import {
    cards,
    energy,
    log,
    matchedIndexes,
    options,
    overlay,
    phase,
    plusIndex,
    score,
  } from "./stores.js";
  import Card from "./Card.svelte";

  const getTargetDataIndex = ({ dataset, parentNode }) => {
    if (dataset && dataset.index) return dataset.index;
    if (parentNode) return getTargetDataIndex(parentNode);
  };

  const boardClick = ({ target }) => {
    if ($phase !== "idle" || $plusIndex) return;
    $plusIndex = Number(getTargetDataIndex(target));
    if (!Number.isNaN($plusIndex)) {
      $energy = { ...$energy, buffer: -10 };
      setTimeout(() => ($phase = "plus"), $options.delay || 400);
    }
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
