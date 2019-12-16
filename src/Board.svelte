<script>
  import { cards, energy, phase } from "./stores.js";
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
          window.setTimeout(() => phase.set("match"), 400);
        } else if ($energy < 10) {
          phase.set("gameover");
        } else {
          phase.set("input");
        }
        break;
      case "match":
        const energyDiff = matchedIndexes.reduce(
          (result, value) => result + $cards[value].type,
          0
        );
        energy.set($energy + energyDiff);
        cards.set(getCardsMatched($cards, matchedIndexes));
        matchedIndexes = [];
        window.setTimeout(() => phase.set("fall"), 600);
        break;
      case "fall":
        cards.set(getCardsFallen($cards));
        window.setTimeout(() => phase.set("blink"), 400);
        break;
      case "gameover":
        alert("GAME OVER");
    }
  });

  const getTargetDataIndex = ({ dataset, parentNode }) => {
    if (dataset && dataset.index) return dataset.index;
    if (parentNode) return getTargetDataIndex(parentNode);
  };
</script>

<style>
  .board {
    background: dimgray
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill-opacity="0.5"><rect x="4" width="4" height="4" /><rect y="4" width="4" height="4" /></svg>');
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
    if ($phase !== 'input' || plusIndex) return;
    plusIndex = +getTargetDataIndex(target);
    if (!isNaN(plusIndex)) {
      energy.set($energy - 10);
      window.setTimeout(() => phase.set('plus'), 400);
    }
  }}>
  {#each $cards as card, index}
    <Card
      phase={$phase}
      plused={plusIndex === index}
      matched={matchedIndexes.includes(index)}
      {...card}
      {index} />
  {/each}
</div>
