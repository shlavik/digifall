<script>
  import Card from "./Card.svelte";

  import { CORE, PHASES } from "./constants.js";
  import {
    cards,
    log,
    matchedIndexes,
    options,
    phase,
    plusIndex,
    seed,
  } from "./stores.js";

  let focusCard;
  let focusCardPrev;

  export function isFocused() {
    return focusCard?.x !== undefined && focusCard?.y !== undefined;
  }

  export function blur(clearPrev = false) {
    focusCardPrev = clearPrev ? undefined : focusCard;
    focusCard = undefined;
  }

  export function shiftFocus({ x = 0, y = 0 } = {}) {
    if (!idle) return {};
    if (focusCard) {
      focusCardPrev = focusCard;
      x += focusCard.x;
      y += focusCard.y;
      const newX = x < 0 ? CORE.columns - 1 : x % CORE.columns;
      const newY = y < 0 ? CORE.rows - 1 : y % CORE.rows;
      return (focusCard = {
        x: newX,
        y: newY,
        topEdge: newY === 0 && focusCardPrev?.y === CORE.rows - 1,
        bottomEdge: newY === CORE.rows - 1 && focusCardPrev?.y === 0,
      });
    }
    if (x !== 0) {
      if (focusCardPrev) {
        focusCard = {
          x: x > 0 ? 0 : CORE.columns - 1,
          y: focusCardPrev.y,
        };
        focusCardPrev = undefined;
        return focusCard;
      }
      return (focusCard = {
        x: Math.round(CORE.columns / 2) + x + (x > 0 ? -1 : 0),
        y: Math.round(CORE.rows / 2) + (x > 0 ? -1 : 0),
      });
    }
    if (y !== 0) {
      if (focusCardPrev) {
        focusCard = {
          x: focusCardPrev.x,
          y: y > 0 ? 0 : CORE.rows - 1,
        };
        focusCardPrev = undefined;
        return focusCard;
      }
      return (focusCard = {
        x: Math.round(CORE.columns / 2) + (y > 0 ? 0 : -1),
        y: Math.round(CORE.rows / 2) + y + (y > 0 ? -1 : 0),
      });
    }
    return focusCard || {};
  }

  export function plusFocus() {
    focusCardPrev = undefined;
    const index = $cards.findIndex(
      ({ x, y }) => x === focusCard.x && y === focusCard.y
    );
    if (index === -1) return;
    $plusIndex = index;
  }

  function plusIndexCard(card) {
    if (progress) return;
    $plusIndex = Number(card.dataset.index);
  }

  function click(event) {
    focusCardPrev = undefined;
    if (!speedrun) return;
    const card = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (!card) return;
    plusIndexCard(card);
  }

  function longpress(event) {
    blur(true);
    if (speedrun) return;
    plusIndexCard(event.target);
  }

  /**
   * Prevent longpress action on Card
   */
  function checkStart() {
    return !speedrun && !progress;
  }

  seed.subscribe(() => ((focusCard = undefined), (focusCardPrev = undefined)));

  $: if ($matchedIndexes.size > 0) focusCard = undefined;
  $: ({ speedrun } = $options);
  $: idle = $phase === PHASES.idle;
  $: blink = $matchedIndexes.size > 0 && $log.length === 1;
  $: overflow = !idle && !blink;
  $: progress = !idle || $plusIndex !== undefined;
  $: plusCard = $cards[$plusIndex];
  $: plusCardMemoized = plusCard || focusCard || plusCardMemoized;
  $: focus = Boolean(plusCard || focusCard || blink);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="board"
  class:overflow
  class:progress
  style:--focus-x={plusCardMemoized?.x}
  style:--focus-y={plusCardMemoized?.y}
  on:click={click}
  on:longpress={longpress}
>
  {#each $cards as card, index}
    <Card
      {card}
      {index}
      blink={$matchedIndexes.has(index)}
      focus={card.x === focusCard?.x && card.y === focusCard?.y}
      plus={$plusIndex === index}
      {checkStart}
    />
  {/each}
  <div class="ghost horizontal" class:blink class:focus />
  <div class="ghost vertical" class:blink class:focus />
  <div class="slider top" class:blink class:focus />
  <div class="slider right" class:blink class:focus />
  <div class="slider bottom" class:blink class:focus />
  <div class="slider left" class:blink class:focus />
</div>
