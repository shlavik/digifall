<script>
  import { phase, blocks, field } from "./stores.js";
  import {
    getBlocksFallen,
    getBlocksMatched,
    getBlocksPlusOne,
    getFieldFromBlocks,
    getMatchedIndexes
  } from "./utils.js";
  import Block from "./Block.svelte";

  blocks.subscribe(value => {
    field.set(getFieldFromBlocks(value, "index"));
  });

  phase.subscribe(value => {
    if (value === "fall") {
      blocks.set(getBlocksFallen($blocks, $field));
    } else if (value === "match") {
      blocks.set(getBlocksMatched($blocks, $field));
    }
  });

  const getNameFromTarget = ({ name, parentNode }) => {
    if (!name && !parentNode) return "!";
    if (name) return name;
    if (parentNode) return getNameFromTarget(parentNode);
  };
</script>

<div
  class="board"
  on:click={({ target }) => {
    const blockIndex = +getNameFromTarget(target);
    if (!isNaN(blockIndex)) blocks.set(getBlocksPlusOne($blocks, blockIndex));
  }}>
  {#each $blocks as block, index}
    <Block {...block} {index} />
  {/each}
</div>
