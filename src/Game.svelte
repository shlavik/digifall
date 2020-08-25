<script>
  import { log, overlay, seed } from "./stores.js";
  import { getRandom } from "./utils.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Log from "./Log.svelte";
  import Score from "./Score.svelte";

  $: style = (() => {
    let arr = [
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97,
      ],
      index = 0,
      random = getRandom($seed),
      temp = [];

    while (++index < 5) {
      const [value] = arr.splice((random = getRandom(random)) % arr.length, 1);
      temp = [...temp, value];
    }

    const [a, b, c, d] = temp;

    const getColor = (lightness = 12) => {
      return `hsl(${(random = getRandom(random) % 360)},50%,${lightness}%)`;
    };

    return `
      background-color: ${getColor()};
      background-image:
        linear-gradient(90deg, ${getColor()} 50%, transparent 50%),
        linear-gradient(90deg, ${getColor()} 50%, transparent 50%),
        linear-gradient(90deg, transparent 50%, ${getColor()} 50%),
        linear-gradient(90deg, transparent 50%, ${getColor()} 50%);
      background-size: ${a}rem, ${b}rem, ${c}rem, ${d}rem;`;
  })();

  const openOverlay = () => ($overlay = true);
</script>

<div class="game" class:blur={$overlay === true} {style}>
  <div class="content">
    <div class="section-1">
      <button
        class="digifall"
        class:screen={$log.length > 0}
        on:click={openOverlay}>
        <span>work in progress</span>
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
  </div>
</div>
