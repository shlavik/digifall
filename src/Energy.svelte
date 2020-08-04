<script>
  import { energy, log, phase, randomColor } from "./stores.js";
  import { getDiffFromBuffer } from "./utils.js";

  let leftBarFlex, rightBarFlex, rightValueLeft;

  const updateRandomColor = () => {
    if ($energy.value > 100 || $phase !== "score") {
      $randomColor = `hsl(${Math.floor(360 * Math.random())}, 100%, 50%)`;
      requestAnimationFrame(updateRandomColor);
    } else {
      $randomColor = "white";
    }
  };

  energy.subscribe(({ buffer, value }) => {
    if ($randomColor === "white") updateRandomColor();
    const diff = getDiffFromBuffer(buffer);
    requestAnimationFrame(() => {
      leftBarFlex = (value > 100 ? 200 - value : value) / 100;
      rightBarFlex = value > 100 ? (value - 100) / 100 : 0;
      rightValueLeft = (() => {
        if (value > 119) return 0;
        return (value > 100 ? value - 120 : -20) / 100;
      })();
      if (diff === 0) return;
      $energy = {
        buffer: buffer - diff,
        value: value + diff,
      };
    });
    if ($phase === "extra") {
      if (diff === 0) return setTimeout(() => ($phase = "total"), 800);
      const [{ extra }] = $log.slice(-1);
      $log = $log.slice(0, -1).concat({ extra: extra - diff });
    }
  });

  $: leftBarStyle = `flex: ${leftBarFlex}`;
  $: leftValueStyle = `position: ${
    $energy.value > 100 ? "absolute" : "relative"
  }`;
  $: rightBarStyle = `background-color: ${
    $energy.value > 100 ? $randomColor : "var(--color-dark)"
  }; flex: ${rightBarFlex}`;
  $: rightValueStyle = `left: calc(${rightValueLeft} * 128rem); position: ${
    $energy.value > 100 ? "relative" : "absolute"
  }`;
</script>

<style>
  .energy {
    background-color: var(--color-dark);
    box-shadow: var(--shadow-inset-1);
    display: flex;
    font-size: 7rem;
    position: relative;
    width: 100%;
  }
  .left-bar,
  .right-bar {
    box-shadow: var(--shadow-1);
    padding: 1rem 0;
    overflow: hidden;
  }
  .left-bar {
    background-color: white;
    text-align: right;
  }
  .right-bar {
    z-index: 1;
  }
  .left-value {
    color: var(--color-dark);
    right: 0;
  }
  .right-value {
    color: white;
  }
</style>

<div class="energy">
  <div class="left-bar" style={leftBarStyle}>
    <span class="left-value" style={leftValueStyle}>{$energy.value}</span>
  </div>
  <div class="right-bar" style={rightBarStyle}>
    <span class="right-value" style={rightValueStyle}>{$energy.value}</span>
  </div>
</div>
