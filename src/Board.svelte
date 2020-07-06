<script>
  import { cards, energy, log, overlay, phase, score } from "./stores.js";
  import {
    getCardsFallen,
    getCardsMatched,
    getCardsPlusOne,
    getMatchedIndexes,
  } from "./utils.js";
  import Card from "./Card.svelte";

  let plusIndex;
  let matchedIndexes = [];

  phase.subscribe(() => {
    console.log($phase);
    switch ($phase) {
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
          const buffer = matchedIndexes.reduce(
            (result, index) => result + $cards[index].value,
            0
          );
          setTimeout(() => energy.set({ ...$energy, buffer }), 400);
          setTimeout(() => phase.set("match"), 800);
        } else if ($energy.value > 100) {
          phase.set("extra");
        } else if ($energy.value < 10) {
          phase.set("gameover");
        } else if ($log.length) {
          phase.set("total");
        } else {
          phase.set("idle");
        }
        break;
      case "match":
        cards.set(getCardsMatched($cards, matchedIndexes));
        matchedIndexes = [];
        setTimeout(() => phase.set("fall"), 400);
        break;
      case "fall":
        cards.set(getCardsFallen($cards));
        setTimeout(() => phase.set("blink"), 400);
        break;
      case "extra":
        log.set($log.concat({ extra: 0 }));
        break;
      case "total":
        score.set({
          ...$score,
          buffer: $log.reduce(
            (result, { extra, sum }, index) => (
              result + (index + 1) * (sum || extra)
            ),
            0
          ),
        });
        setTimeout(() => {
          phase.set("score");
          score.set({ ...$score });
        }, 1000);
        break;
      case "score":
        break;
      case "gameover":
        overlay.set(true);
        break;
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
      energy.set({ ...$energy, buffer: -10 });
      setTimeout(() => phase.set("plus"), 400);
    }
  };
</script>

<style>
  .board {
    background-color: var(--color-board);
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill-opacity=".6"><rect x="4" width="4" height="4" /><rect y="4" width="4" height="4" /></svg>');
    background-size: 6rem 6rem;
    border: 1rem solid var(--color-dark);
    filter: drop-shadow(var(--shadow-inset-2));
    height: 128rem;
    position: relative;
    width: 128rem;
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
