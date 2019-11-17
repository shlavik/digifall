<script>
  import { phase, blocks, field, getDefaultField } from "./stores.js";
  import Block from "./Block.svelte";

  const getFieldFromBlocks = (blocks, type = "index") => {
    const newField = getDefaultField();
    blocks.forEach((block, index) => {
      newField[block.x][block.y] = type === "index" ? index : block.type;
    });
    return newField;
  };

  phase.subscribe(value => {
    if (value === "fall") field.set(getFieldFromBlocks($blocks, "index"));
    else if (value === "count") field.set(getFieldFromBlocks($blocks, "type"));
  });

  field.subscribe(value => {
    if ($phase === "fall") {
      let newBlocks = [];
      let countX = 0;
      for (let x in value) {
        let countY = 0;
        for (let y in value[x]) {
          const blockIndex = value[x][y];
          if (blockIndex !== undefined) {
            const { type, duration, x, y } = $blocks[blockIndex];
            newBlocks[blockIndex] = {
              type,
              duration: (1 - 0.4 * countY / 7) * countY * 75,
              x,
              y: y - countY
            };
          } else countY += 1;
          countX += countY;
        }
      }
      blocks.set(newBlocks);
    } else if ($phase === "count") {

    }
  });

  blocks.subscribe(value => {
    if ($phase === "init") field.set(getFieldFromBlocks(value, "index"));
    if ($phase === "fall") phase.set("count");
  });

  const getNameFromTarget = ({ name, parentNode }) => {
    if (!name && !parentNode) return "!";
    if (name) return name;
    if (parentNode) return getNameFromTarget(parentNode);
    return "?";
  };

  const getNewXY = ({ x, y }) => ({
    x,
    y:
      1 +
      $blocks
        .filter(block => block.x === x)
        .sort(({ y: y1 }, { y: y2 }) => y1 - y2)[6].y
  });
</script>

<div
  class="board"
  on:click={({ target }) => {
    const blockIndex = +getNameFromTarget(target);
    if (!isNaN(blockIndex)) blocks.set($blocks.map((block, index) =>
          index === blockIndex && block.y < 7
            ? { type: ~~(Math.random() * 10), duration: 0, ...getNewXY(block) }
            : block
        ));
  }}>
  {#each $blocks as block, index}
    <Block {...block} {index} />
  {/each}
</div>
