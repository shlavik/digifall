<script>
  import { phase, blocks, field, getDefaultField } from "./stores.js";
  import Block from "./Block.svelte";

  const getFieldFromBlocks = (blocks, type = "index") => {
    const newField = getDefaultField();
    blocks.forEach(
      (block, index) =>
        (newField[block.x][block.y] = type === "index" ? index : block.type)
    );
    return newField;
  };

  blocks.subscribe(value => {
    field.set(getFieldFromBlocks(value, "index"));
  });

  phase.subscribe(value => {
    if (value === "fall") {
      let newBlocks = [];
      for (let x in $field) {
        let countY = 0;
        for (let y in $field[x]) {
          const blockIndex = $field[x][y];
          if (blockIndex !== undefined) {
            const block = $blocks[blockIndex];
            newBlocks[blockIndex] = {
              ...block,
              duration: (1 - (0.4 * countY) / 7) * countY * 75,
              y: y - countY
            };
          } else countY += 1;
        }
      }
      blocks.set(newBlocks);
    }
    phase.set("count");
  });

  const getNameFromTarget = ({ name, parentNode }) => {
    if (!name && !parentNode) return "!";
    if (name) return name;
    if (parentNode) return getNameFromTarget(parentNode);
    return "?";
  };

  const getNewY = ({ x, y }) =>
    1 +
    $blocks
      .filter(block => block.x === x)
      .sort(({ y: y1 }, { y: y2 }) => y1 - y2)[6].y;
</script>

<div
  class="board"
  on:click={({ target }) => {
    const blockIndex = +getNameFromTarget(target);
    if (!isNaN(blockIndex)) blocks.set($blocks.map((block, index) =>
          index === blockIndex && block.y < 7
            ? {
                ...block,
                type: block.type === 9 ? 0 : block.type + 1,
                duration: 0
              }
            : block
        ));
  }}>
  {#each $blocks as block, index}
    <Block {...block} {index} />
  {/each}
</div>

<!-- <div
  class="board"
  on:click={({ target }) => {
    const blockIndex = +getNameFromTarget(target);
    if (!isNaN(blockIndex)) blocks.set($blocks.map((block, index) =>
          index === blockIndex && block.y < 7
            ? {
                ...block,
                type: ~~(Math.random() * 10),
                duration: 0,
                y: getNewY(block)
              }
            : block
        ));
  }}>
  {#each $blocks as block, index}
    <Block {...block} {index} />
  {/each}
</div> -->
