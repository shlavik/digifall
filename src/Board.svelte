<script>
  import Card from "./Card.svelte";

  import { longpress } from "./actions.js";
  import { CORE, PHASES } from "./constants.js";
  import { getFieldFromCards } from "./core";
  import {
    playHit,
    playPlus,
    playSlideIn,
    playSlideMove,
    playSlideOut,
  } from "./sounds";
  import game, {
    cards,
    checkSound,
    log,
    matchedIndexes,
    options,
    phase,
    plusIndex,
    seed,
  } from "./stores.js";

  let focusedCard = null;
  let focusedCardPrev = null;
  let longpressedIndex = undefined;
  let boardElement = null;
  let sliderHorizontalElement = null;
  let sliderVerticalElement = null;

  export function isFocused() {
    return Boolean(focusedCard);
  }

  export function shiftFocus({ x = 0, y = 0 } = {}) {
    if (!idle) return {};
    highlightGhost();
    if (focusedCard) {
      focusedCardPrev = focusedCard;
      x += focusedCard.x;
      y += focusedCard.y;
      const newX = x < 0 ? CORE.columns - 1 : x % CORE.columns;
      const newY = y < 0 ? CORE.rows - 1 : y % CORE.rows;
      return focusCard({
        x: newX,
        y: newY,
        topEdge:
          newY === 0 && focusedCardPrev && focusedCardPrev.y === CORE.rows - 1,
        bottomEdge:
          newY === CORE.rows - 1 && focusedCardPrev && focusedCardPrev.y === 0,
      });
    }
    if (x !== 0) {
      if (focusedCardPrev) {
        newValue = {
          x: x > 0 ? 0 : CORE.columns - 1,
          y: focusedCardPrev.y,
        };
        focusedCardPrev = null;
        return focusCard(newValue);
      }
      return focusCard({
        x: Math.round(CORE.columns / 2) + x + (x > 0 ? -1 : 0),
        y: Math.round(CORE.rows / 2) + (x > 0 ? 0 : -1),
      });
    }
    if (y !== 0) {
      if (focusedCardPrev) {
        const newValue = {
          x: focusedCardPrev.x,
          y: y > 0 ? 0 : CORE.rows - 1,
        };
        focusedCardPrev = null;
        return focusCard(newValue);
      }
      return focusCard({
        x: Math.round(CORE.columns / 2) + (y > 0 ? -1 : 0),
        y: Math.round(CORE.rows / 2) + y + (y > 0 ? -1 : 0),
      });
    }
    return focusedCard || {};
  }

  export function plusFocusedCard() {
    if (!isFocused()) return;
    focusedCardPrev = null;
    const index = $cards.findIndex(
      ({ x, y }) => x === focusedCard.x && y === focusedCard.y,
    );
    if (index === -1) return;
    $plusIndex = index;
    if (progress) return;
    checkSound(playPlus, { muteRapid: true });
  }

  export function focusCard(newValue) {
    if (!isFocused()) checkSound(playSlideIn);
    const index = field[newValue.x][newValue.y];
    checkSound(() => playSlideMove($cards[index].value));
    return (focusedCard = newValue);
  }

  export function blur({ savePrev = false, muteSound = false } = {}) {
    if (!isFocused()) return;
    focusedCardPrev = savePrev ? focusedCard : null;
    focusedCard = null;
    if (!muteSound) checkSound(playSlideOut);
  }

  function highlightGhost() {
    sliderHorizontalElement.style.animation = "none";
    sliderHorizontalElement.offsetHeight;
    sliderHorizontalElement.style.animation = null;
    sliderVerticalElement.style.animation = "none";
    sliderVerticalElement.offsetHeight;
    sliderVerticalElement.style.animation = null;
  }

  function hoverCard(index) {
    if (progress) return;
    if (longpressedIndex !== undefined) return;
    if (!isFocused()) checkSound(playSlideIn);
    const currentCard = $cards[index];
    if (currentCard !== focusedCard) {
      highlightGhost();
      checkSound(() => playSlideMove(currentCard.value));
      focusedCardPrev = focusedCard;
      focusedCard = currentCard;
    }
  }

  function findNearestCard(element) {
    if (element === boardElement) return undefined;
    if (element.classList.contains("card")) return element;
    const cardChild = element.querySelector(".card");
    if (cardChild) return cardChild;
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains("card")) return parent;
      parent = parent.parentElement;
    }
    return undefined;
  }

  function findCardIndex(boardEvent) {
    const cardElement = findNearestCard(boardEvent.target);
    return cardElement && Number(cardElement.dataset.index);
  }

  function mouseMove(event) {
    if (!game.ready) return;
    const index = findCardIndex(event);
    if (index > -1) hoverCard(index);
  }

  function mouseLeave(event) {
    blur({ muteSound: $phase !== PHASES.idle });
  }

  function longpressStart(event) {
    if (progress) return;
    const index = findCardIndex(event.detail);
    if (index === undefined) return;
    hoverCard(index);
    if (!rapid) longpressedIndex = index;
    if (event.detail.type !== "mousedown") return;
    checkSound(() => playHit($cards[index].value), { onlyOnIdle: true });
    if (rapid) plusFocusedCard();
  }

  function longpressFire(event) {
    if (rapid) return;
    const index = findCardIndex(event.detail);
    if (index !== longpressedIndex) return;
    longpressedIndex = undefined;
    plusFocusedCard();
    blur();
  }

  function longpressEnd(event) {
    if (!rapid) longpressedIndex = undefined;
  }

  function dblclick(event) {
    event.preventDefault();
  }

  seed.subscribe(() => blur({ muteSound: true }));

  $: if ($matchedIndexes.size > 0) blur({ muteSound: true });
  $: ({ rapid } = $options);
  $: idle = $phase === PHASES.idle;
  $: blink = $matchedIndexes.size > 0 && $log.length === 1;
  $: overflow = !idle && !blink;
  $: progress = !idle || $plusIndex !== undefined;
  $: plusCard = $cards[$plusIndex];
  $: focusMemoized = plusCard || focusedCard || focusMemoized;
  $: sliderFocus = plusCard || focusedCard || blink;
  $: field = getFieldFromCards($cards);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="board"
  class:overflow
  class:progress
  style:--focus-x={focusMemoized && focusMemoized.x}
  style:--focus-y={focusMemoized && focusMemoized.y}
  tabindex="0"
  role="button"
  on:mousemove={mouseMove}
  on:mouseleave={mouseLeave}
  on:longpressstart={longpressStart}
  on:longpressfire={longpressFire}
  on:longpressend={longpressEnd}
  on:dblclick={dblclick}
  use:longpress
  bind:this={boardElement}
>
  {#each $cards as card, index (index)}
    {@const focus =
      card.x === (focusedCard && focusedCard.x) &&
      card.y === (focusedCard && focusedCard.y)}
    <Card
      {card}
      {index}
      {focus}
      blink={$matchedIndexes.has(index)}
      longpress={longpressedIndex === index}
      plus={$plusIndex === index}
    />
  {/each}
  <div
    class="slider horizontal"
    class:blink
    class:focus={sliderFocus}
    bind:this={sliderHorizontalElement}
  ></div>
  <div
    class="slider vertical"
    class:blink
    class:focus={sliderFocus}
    bind:this={sliderVerticalElement}
  ></div>
</div>

<style>
  :global .board {
    position: relative;
    width: 128rem;
    height: 128rem;
    border: 1rem solid var(--color-dark);
    background-color: var(--color-body);
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill-opacity=".6"><rect x="4" width="4" height="4" /><rect y="4" width="4" height="4" /></svg>');
    background-size: 6rem;
    box-shadow: var(--gloss-inset), var(--shadow-inset);

    &::before {
      position: absolute;
      z-index: 1;
      top: -1rem;
      left: -1rem;
      display: block;
      width: 128rem;
      height: 1rem;
      box-shadow: var(--shadow-inset);
      content: "";
    }

    &::after {
      position: absolute;
      bottom: calc(-1rem);
      left: -1rem;
      width: 128rem;
      height: 1px;
      background-color: var(--color-gloss);
      content: "";
    }

    &.overflow .slider {
      border-color: transparent;
    }

    &:not(.progress) .slider {
      transition-duration: 200ms;
      transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    .slider {
      position: absolute;
      z-index: 10;
      width: 128rem;
      height: 128rem;
      border-width: 0;
      border-style: solid;
      border-color: white;
      background-color: transparent;
      inset: -1rem;
      mix-blend-mode: luminosity;
      outline-color: transparent;
      outline-offset: -1px;
      outline-style: solid;
      pointer-events: none;

      &.blink {
        opacity: 0.8;
      }

      &.focus {
        animation: focus 250ms ease-in;
        background-color: var(--color-ghost);
        outline-color: var(--color-focus);
      }

      &.horizontal {
        border-right-width: 1rem;
        border-left-width: 1rem;
        transition-property: top, bottom, height, background-color;

        &.blink {
          animation:
            blink 200ms steps(2, end) 2,
            shrink-vertical 400ms ease 400ms forwards;
        }

        &.focus {
          top: calc(126rem - 21rem * (var(--focus-y) + 1));
          bottom: calc(var(--focus-y) * 21rem);
          height: 21rem;
        }
      }

      &.vertical {
        border-top-width: 1rem;
        border-bottom-width: 1rem;
        transition-property: right, left, width, background-color;

        &.blink {
          animation:
            blink 200ms steps(2, end) 2,
            shrink-horizontal 400ms ease 400ms forwards;
        }

        &.focus {
          right: calc(126rem - 21rem * (var(--focus-x) + 1));
          left: calc(var(--focus-x) * 21rem);
          width: 21rem;
        }
      }
    }
  }

  @keyframes focus {
    0% {
      background-color: var(--color-ghost);
    }

    40% {
      background-color: var(--color-focus);
    }

    60% {
      background-color: var(--color-focus);
    }

    100% {
      background-color: var(--color-ghost);
    }
  }

  @keyframes shrink-horizontal {
    from {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    }

    to {
      clip-path: polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%);
    }
  }

  @keyframes shrink-vertical {
    from {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    }

    to {
      clip-path: polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%);
    }
  }
</style>
