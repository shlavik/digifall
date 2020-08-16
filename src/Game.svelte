<script>
  import { log,overlay,seed } from "./stores.js";
  import Board from "./Board.svelte";
  import Energy from "./Energy.svelte";
  import Log from "./Log.svelte";
  import Score from "./Score.svelte";

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  let hue = Math.round(Math.random() * 360);

  const getRandomColorShift = (lightness = 7) => {
    hue += 30 + Math.round(Math.random() * 42);
    return `hsl(${hue},100%,${lightness}%)`;
  };

  const getNewGameBackground = () => {
    const [a, b, c, d] = shuffleArray([
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
    ]);
    return `
      background-color: ${getRandomColorShift()};
      background-image:
        linear-gradient(90deg, ${getRandomColorShift()} 50%, transparent 50%),
        linear-gradient(90deg, ${getRandomColorShift()} 50%, transparent 50%),
        linear-gradient(90deg, transparent 50%, ${getRandomColorShift()} 50%),
        linear-gradient(90deg, transparent 50%, ${getRandomColorShift()} 50%);
      background-size: ${a}rem, ${b}rem, ${c}rem, ${d}rem;`;
  };

  let style = getNewGameBackground();

  $: console.log($seed);

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
