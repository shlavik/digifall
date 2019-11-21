<script>
  import { phase, blocks, energy } from "./stores.js";
  import {
    getBlocksFallen,
    getBlocksMatched,
    getBlocksPlusOne
  } from "./utils.js";
  import Block from "./Block.svelte";

  phase.subscribe(value => {
    if (value === "fall") {
      blocks.set(getBlocksFallen($blocks));
    } else if (value === "match") {
      blocks.set(getBlocksMatched($blocks, $energy, energy.set));
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
    const blockIndex = +getNameFromTarget(target);
    if (!isNaN(blockIndex)) {
      blocks.set(getBlocksPlusOne($blocks, blockIndex));
      energy.set($energy - 10);
    }
  }}>
  {#each $blocks as block, index}
    <Block {...block} {index} />
  {/each}
</div>
