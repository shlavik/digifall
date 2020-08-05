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
    switch ($phase) {
      case "plus":
        $cards = getCardsPlusOne($cards, plusIndex);
        $phase = "blink";
        break;
      case "blink":
        plusIndex = undefined;
        matchedIndexes = getMatchedIndexes($cards);
        if (matchedIndexes.length > 0) {
          $log = $log.concat(
            matchedIndexes.reduce((result, index) => {
              const { value } = $cards[index];
              result[value] = (result[value] || 0) + value;
              result.sum = (result.sum || 0) + value;
              return result;
            }, {})
          );
          const buffer = matchedIndexes.reduce(
            (result, index) => result + $cards[index].value,
            0
          );
          setTimeout(() => ($energy = { ...$energy, buffer }), 400);
          setTimeout(() => ($phase = "match"), 800);
        } else if ($energy.value > 100) {
          $phase = "extra";
        } else if ($energy.value < 10) {
          $phase = "gameover";
        } else if ($log.length > 0) {
          $phase = "total";
        } else {
          $phase = "idle";
        }
        break;
      case "match":
        $cards = getCardsMatched($cards, matchedIndexes);
        matchedIndexes = [];
        setTimeout(() => ($phase = "fall"), 400);
        break;
      case "fall":
        $cards = getCardsFallen($cards);
        setTimeout(() => ($phase = "blink"), 400);
        break;
      case "extra":
        $log = $log.concat({ extra: 0 });
        $energy = { ...$energy, buffer: 100 - $energy.value };
        break;
      case "total":
        $score = {
          ...$score,
          buffer: $log.reduce(
            (result, { extra, sum }, index) =>
              result + (index + 1) * (sum || extra),
            0
          ),
        };
        setTimeout(() => ($phase = "score"), $log.length > 1 ? 800 : 0);
        break;
      case "score":
        $score = { ...$score };
        break;
      case "gameover":
        $overlay = true;
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
      $energy = { ...$energy, buffer: -10 };
      setTimeout(() => ($phase = "plus"), 400);
    }
  };
</script>

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
