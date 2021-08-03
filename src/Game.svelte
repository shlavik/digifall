<script>
  import Board from "./Board.svelte";
  import { CSS_VARS } from "./constants";
  import Energy from "./Energy.svelte";
  import Log from "./Log.svelte";
  import Score from "./Score.svelte";

  import { log, options, overlay, seed } from "./stores.js";
  import { getRandom } from "./utils.js";

  function showMenu() {
    $overlay = true;
  }

  $: style = (() => {
    if (!$seed || !$options.seedground) return;
    let random = $seed;
    const getColor = (lightness = 16) => {
      return `hsl(${(random = getRandom(random) % 360)},50%,${lightness}%)`;
    };
    const arr = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
      71, 73, 79, 83, 89, 97,101, 103, 107, 109, 113, 127, 131, 137, 139, 149
    ];
    let count = 4,
      temp = [];
    while (count--) {
      const [value] = arr.splice((random = getRandom(random)) % arr.length, 1);
      temp = temp.concat(value);
    }
    const [a, b, c, d] = temp;
    return `
      background-color: var(${CSS_VARS.colorDark}));
      background-image:
        linear-gradient(90deg, ${getColor()} 50%, transparent 50%),
        linear-gradient(90deg, ${getColor()} 50%, transparent 50%),
        linear-gradient(90deg, transparent 50%, ${getColor()} 50%),
        linear-gradient(90deg, transparent 50%, ${getColor()} 50%);
      background-size: ${a}rem, ${b}rem, ${c}rem, ${d}rem;`;
  })();
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
          <span class="big">digifall</span>
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
