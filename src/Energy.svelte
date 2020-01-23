<script>
  import { energy } from "./stores.js";

  const getBarWidth = value => {
    if (value > 100) return 100;
    if (value < 0) return 0;
    return value;
  };
</script>

<style>
  .energy {
    background-color: hsl(60, 20%, 30%);
    flex-basis: var(--pixel-11);
    overflow: hidden;
  }
  .bar {
    align-items: center;
    background-color: white;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    transition: width 200ms ease-in;
  }
  .value {
    color: hsl(60, 20%, 30%);
    font-size: var(--pixel-7);
    letter-spacing: var(--pixel);
    line-height: 1;
  }
</style>

<div class="energy">
  <div class="bar" style={`width: ${getBarWidth($energy)}%`}>
    <span class="value">{$energy}</span>
  </div>
</div>
