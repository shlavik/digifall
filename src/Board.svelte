<script>
  import { blocks } from "./stores.js";
  import Block from "./Block.svelte";

  let blockIndex;

  const getNewY = ({ x, y }) =>
    1 +
    $blocks
      .filter(block => block.x === x)
      .sort(({ y: y1 }, { y: y2 }) => y1 - y2)[6].y;

  $: {
    if (!isNaN(blockIndex))
      blocks.set(
        $blocks.map((block, index) =>
          index === blockIndex ? { ...block, y: getNewY(block) } : block
        )
      );
  }

  const getNameFromTarget = ({ name, parentNode }) => {
    if (!name && !parentNode) return "!";
    if (name) return name;
    if (parentNode) return getNameFromTarget(parentNode);
    return "?";
  };
</script>

<div
  class="board"
  on:click={({ target }) => (blockIndex = +getNameFromTarget(target))}>
  {#each $blocks as props, index}
    <Block {index} {...props} />
  {/each}
</div>
