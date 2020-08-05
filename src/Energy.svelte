<script>
  import { energy, log, phase, randomColor } from "./stores.js";
  import { getDiffFromBuffer } from "./utils.js";

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

  $: value = $energy.value;
  $: isExtra = value > 100;
  $: leftBarStyle = `flex: ${(isExtra ? 200 - value : value) / 100}; z-index: ${
    isExtra ? 0 : 1
  }`;
  $: leftValueStyle = `position: ${isExtra ? "absolute" : "relative"}`;
  $: rightBarStyle = `background-color: ${
    isExtra ? $randomColor : "var(--color-dark)"
  }; flex: ${isExtra ? (value - 100) / 100 : 0}; z-index: ${isExtra ? 1 : 0}`;
  $: rightValueStyle = `left: ${
    isExtra ? `calc(${value > 119 ? 0 : (value - 120) / 100} * 128rem)` : 0
  }; position: ${isExtra ? "relative" : "absolute"}`;
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
