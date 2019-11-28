<script>
  import { phase, blocks, energy } from "./stores.js";
  import {
    getBlocksFallen,
    getBlocksMatched,
    getBlocksPlusOne,
    getMatchedIndexes
  } from "./utils.js";
  import Block from "./Block.svelte";

  let matchedIndexes = [];

  phase.subscribe(value => {
    if (value === "blink") {
      matchedIndexes = getMatchedIndexes($blocks);
      if (matchedIndexes.length) {
        setTimeout(() => phase.set("match"), 600);
      } else {
        phase.set("input");
      }
    } else if (value === "match") {
      const energyDiff = matchedIndexes.reduce(
        (result, value) => result + $blocks[value].type,
        0
      );
      energy.set($energy + energyDiff);
      blocks.set(getBlocksMatched($blocks, matchedIndexes));
      setTimeout(() => phase.set("fall"), 600);
    } else if (value === "fall") {
      matchedIndexes = [];
      blocks.set(getBlocksFallen($blocks));
      setTimeout(() => phase.set("blink"), 400);
    }
  });

  const getTargetDataIndex = ({ dataset, parentNode }) => {
    if (dataset && dataset.index) return dataset.index;
    if (parentNode) return getTargetDataIndex(parentNode);
  };
</script>

<style>
  .board {
    background: darkgray
      url('data:image/svg+xml,\
<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill-opacity="0.5">\
  <rect x="4" width="4" height="4" />\
  <rect y="4" width="4" height="4" />\
</svg>');
    background-size: var(--pixel-4) var(--pixel-4);
    border: var(--pixel) solid white;
    box-sizing: border-box;
    height: var(--game-width);
    overflow: hidden;
    position: relative;
    width: var(--game-width);
  }
</style>

<div
  class="board"
  on:click={({ target }) => {
    if ($phase !== 'input') return;
    const blockIndex = getTargetDataIndex(target);
    if (blockIndex) {
      blocks.set(getBlocksPlusOne($blocks, +blockIndex));
      energy.set($energy - 10);
      phase.set('blink');
    }
  }}>
  {#each $blocks as block, index}
    <Block
      matched={matchedIndexes.includes(index)}
      phase={$phase}
      {...block}
      {index} />
  {/each}
</div>
