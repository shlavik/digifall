<script>
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Log from "./Log.svelte";
  import Score from "./Score.svelte";

  import { OVERLAYS } from "./constants";
  import { getRandom } from "./core.js";
  import { log, options, overlay, seed } from "./stores.js";

  function showMenu() {
    $overlay = OVERLAYS.menu;
  }

  function getSeedgroundStyle(landscape, random) {
    if (!landscape || !random) return;
    const getNextRandom = () => (random = getRandom(random));
    const getColor = (lightness = 16) => {
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

  $: style = getSeedgroundStyle($options.landscape, $seed);
</script>

<div class="game" class:blur={$overlay}>
  <div class="seedground" {style} />
  <div class="content">
    {#if $seed}
      <div class="section-1">
        <button
          class="digifall"
          class:screen={$log.length > 0}
          on:click={showMenu}
        >
          {#if !$overlay}<span class="big">digifall</span>{/if}
          <Log />
        </button>
      </div>
      <div class="section-2">
        <Score />
      </div>
      <div class="section-3">
        <Board />
      </div>
      <div class="section-4">
        <Energy />
      </div>
    {/if}
  </div>
</div>
