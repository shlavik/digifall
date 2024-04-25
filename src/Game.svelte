<script>
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Log from "./Log.svelte";
  import Score from "./Score.svelte";

  import { OVERLAYS } from "./constants.js";
  import { getRandom } from "./core.js";
  import { combos, log, options, overlay, seed } from "./stores.js";

  let digifallElement = null;
  let scoreComponent = null;
  let boardComponent = null;

  $: if (digifallElement) {
    digifallElement.isFocused = () =>
      digifallElement.classList.contains("focus");
    digifallElement.focus = () => digifallElement.classList.add("focus");
    digifallElement.blur = () => digifallElement.classList.remove("focus");
  }

  export function moveUp() {
    digifallElement.isFocused()
      ? (digifallElement.blur(), boardComponent.shiftFocus({ y: 1 }))
      : scoreComponent.isFocused()
        ? (scoreComponent.blur(), digifallElement.focus())
        : boardComponent.shiftFocus({ y: 1 }).topEdge
          ? (boardComponent.blur({ savePrev: true }), scoreComponent.focus())
          : null;
  }

  export function moveDown() {
    digifallElement.isFocused()
      ? (digifallElement.blur(), scoreComponent.focus())
      : scoreComponent.isFocused()
        ? (scoreComponent.blur(), boardComponent.shiftFocus({ y: -1 }))
        : boardComponent.shiftFocus({ y: -1 }).bottomEdge
          ? (boardComponent.blur({ savePrev: true }), digifallElement.focus())
          : null;
  }

  export function moveLeft() {
    digifallElement.isFocused()
      ? null
      : scoreComponent.isFocused()
        ? scoreComponent.prevType()
        : boardComponent.shiftFocus({ x: -1 });
  }

  export function moveRight() {
    digifallElement.isFocused()
      ? null
      : scoreComponent.isFocused()
        ? scoreComponent.nextType()
        : boardComponent.shiftFocus({ x: 1 });
  }

  export function perfomAction() {
    digifallElement.isFocused()
      ? (digifallElement.click(),
        digifallElement.blur(),
        boardComponent.blur({ savePrev: true }))
      : scoreComponent.isFocused()
        ? scoreComponent.nextType()
        : boardComponent.plusFocusedCard();
  }

  export function blur() {
    digifallElement.blur();
    scoreComponent.blur();
    boardComponent.blur();
  }

  function getSeedgroundStyle(random) {
    if (!random) return;
    const getNextRandom = () => (random = getRandom(random));
    const getColor = (lightness = 13) => {
      return `hsl(${getNextRandom() % 360},50%,${lightness}%)`;
    };
    const arr = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
      71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149,
    ];
    let count = 4;
    const sizes = [];
    while (count--) {
      const [size] = arr.splice(getNextRandom() % arr.length, 1);
      sizes.push(size);
    }
    const [a, b, c, d] = sizes;
    return `
      background-color: var(--color-dark);
      background-image:
        linear-gradient(90deg, ${getColor()} 50%, transparent 50%),
        linear-gradient(90deg, ${getColor()} 50%, transparent 50%),
        linear-gradient(90deg, transparent 50%, ${getColor()} 50%),
        linear-gradient(90deg, transparent 50%, ${getColor()} 50%);
      background-size: ${a}rem, ${b}rem, ${c}rem, ${d}rem;`;
  }

  $: screen = $log.length > 0 || $combos.length > 0;
</script>

<div class="game" class:blur={$overlay}>
  <div class="seedground" style={getSeedgroundStyle($seed)} />
  <div class="content">
    {#if $seed}
      <div class="section-1">
        <button
          class="digifall"
          class:screen
          on:click={() => ($overlay = OVERLAYS.menu)}
          bind:this={digifallElement}
        >
          <h1>
            digifall
            {#if $options.rapid}<span class="rapid">rapid</span>{/if}
          </h1>
          <Log />
        </button>
      </div>
      <div class="section-2">
        <Score bind:this={scoreComponent} />
      </div>
      <div class="section-3">
        <Board bind:this={boardComponent} />
      </div>
      <div class="section-4">
        <Energy />
      </div>
    {/if}
  </div>
</div>
