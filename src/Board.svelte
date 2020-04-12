<script>
  import { cards, energy, phase, overlay } from "./stores.js";
  import {
    getCardsFallen,
    getCardsMatched,
    getCardsPlusOne,
    getMatchedIndexes
  } from "./utils.js";
  import Card from "./Card.svelte";

  let plusIndex;
  let matchedIndexes = [];

  phase.subscribe(value => {
    switch (value) {
      case "plus":
        cards.set(getCardsPlusOne($cards, plusIndex));
        phase.set("blink");
        break;
      case "blink":
        plusIndex = undefined;
        matchedIndexes = getMatchedIndexes($cards);
        if (matchedIndexes.length) {
          setTimeout(() => phase.set("match"), 600);
        } else if ($energy < 10) {
          phase.set("gameover");
        } else {
          if ($energy > 100) energy.set(100);
          phase.set("idle");
        }
        break;
      case "match":
        const energyDiff = matchedIndexes.reduce(
          (result, value) => result + $cards[value].value,
          0
        );
        energy.set($energy + energyDiff);
        cards.set(getCardsMatched($cards, matchedIndexes));
        matchedIndexes = [];
        setTimeout(() => phase.set("fall"), 600);
        break;
      case "fall":
        cards.set(getCardsFallen($cards));
        setTimeout(() => phase.set("blink"), 400);
        break;
      case "gameover":
        overlay.set(true);
    }
  });

  const getTargetDataIndex = ({ dataset, parentNode }) => {
    if (dataset && dataset.index) return dataset.index;
    if (parentNode) return getTargetDataIndex(parentNode);
  };

  const handleBoardClick = ({ target }) => {
    if ($phase !== "idle" || plusIndex) return;
    plusIndex = Number(getTargetDataIndex(target));
    if (!Number.isNaN(plusIndex)) {
      energy.set($energy - 10);
      setTimeout(() => phase.set("plus"), 400);
    }
  };
</script>

<style>
  .board {
    background: hsl(60, 20%, 10%)
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill-opacity="0.4"><rect x="4" width="4" height="4" /><rect y="4" width="4" height="4" /></svg>');
    background-size: var(--pixel-6) var(--pixel-6);
    border: var(--pixel) solid hsl(60, 20%, 60%);
    box-shadow: inset var(--shadow-2);
    box-sizing: border-box;
    height: var(--game-width);
    position: relative;
    width: var(--game-width);
  }
  .overflow {
    overflow: hidden;
  }
</style>

<div
  class="board"
  class:overflow={$phase !== 'idle'}
  on:click={handleBoardClick}>
  {#each $cards as card, index}
    <Card
      phase={$phase}
      plused={plusIndex === index}
      matched={matchedIndexes.includes(index)}
      {...card}
      {index} />
  {/each}
</div>
