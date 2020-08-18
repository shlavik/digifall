<script>
  import { energy, randomColor } from "./stores.js";

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

<div class="energy">
  <div class="left-bar" style={leftBarStyle}>
    <span class="left-value" style={leftValueStyle}>{$energy.value}</span>
  </div>
  <div class="right-bar" style={rightBarStyle}>
    <span class="right-value" style={rightValueStyle}>{$energy.value}</span>
  </div>
</div>
