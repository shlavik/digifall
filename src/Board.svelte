<script>
  import { cards, energy, log, overlay, score, phase } from "./stores.js";
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
          log.set(
            $log.concat(
              matchedIndexes.reduce((result, index) => {
                const { value } = $cards[index];
                result[value] = (result[value] || 0) + value;
                result.sum = (result.sum || 0) + value;
                return result;
              }, {})
            )
          );
          setTimeout(() => phase.set("match"), 800);
        } else if ($energy < 10) {
          phase.set("gameover");
        } else {
          phase.set("idle");
          if ($energy > 100) energy.set(100);
          if ($log.length) log.set([]);
        }
        break;
      case "match":
        const energyDiff = matchedIndexes.reduce(
          (result, index) => result + $cards[index].value,
          0
        );
        energy.set($energy + energyDiff);
        cards.set(getCardsMatched($cards, matchedIndexes));
        matchedIndexes = [];
        setTimeout(() => phase.set("fall"), 400);
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

  const boardClick = ({ target }) => {
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
    background: var(--color-board)
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill-opacity=".6"><rect x="4" width="4" height="4" /><rect y="4" width="4" height="4" /></svg>');
    background-size: var(--pixel-6) var(--pixel-6);
    border: var(--pixel) solid var(--color-dark);
    filter: drop-shadow(var(--shadow-inset-2));
    height: var(--pixel-board);
    position: relative;
    width: var(--pixel-board);
  }
</style>

<div
  class="board"
  class:overflow-hidden={$phase !== 'idle'}
  on:click={boardClick}>
  {#each $cards as card, index}
    <Card
      clickable={$phase === 'idle' && !plusIndex}
      fallPhase={$phase === 'fall'}
      matched={matchedIndexes.includes(index)}
      plused={plusIndex === index}
      {...card}
      {index} />
  {/each}
</div>
