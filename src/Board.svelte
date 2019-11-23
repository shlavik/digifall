<script>
  import { phase, blocks, energy } from "./stores.js";
  import {
    getBlocksFallen,
    getBlocksMatched,
    getBlocksPlusOne,
    getMatchedIndexes
  } from "./utils.js";
  import Block from "./Block.svelte";

  phase.subscribe(value => {
    if (value === "match") {
      const matchedIndexes = getMatchedIndexes($blocks);
      if (matchedIndexes.length) {
        const energyDiff = matchedIndexes.reduce(
          (result, value) => result + $blocks[value].type,
          0
        );
        energy.set($energy + energyDiff);
        blocks.set(getBlocksMatched($blocks, matchedIndexes));
        setTimeout(() => phase.set("fall"), 500);
      } else {
        phase.set("input");
      }
    } else if (value === "fall") {
      blocks.set(getBlocksFallen($blocks));
      setTimeout(() => phase.set("match"), 500);
    }
  });

  const getNameFromTarget = ({ name, parentNode }) => {
    if (!name && !parentNode) return;
    if (name) return name;
    if (parentNode) return getNameFromTarget(parentNode);
  };
</script>

<div
  class="board"
  on:click={({ target }) => {
    if ($phase !== 'input') return;
    const blockIndex = +getNameFromTarget(target);
    if (!isNaN(blockIndex)) {
      blocks.set(getBlocksPlusOne($blocks, blockIndex));
      energy.set($energy - 10);
      phase.set('match');
    }
  }}>
  {#each $blocks as block, index}
    <Block phase={$phase} {...block} {index} />
  {/each}
</div>
