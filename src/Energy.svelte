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
    background-color: hsl(60, 20%, 25%);
    box-shadow: inset var(--shadow-1);
    flex-basis: var(--pixel-11);
    width: 100%;
  }
  .bar {
    align-items: center;
    background-color: white;
    box-shadow: var(--shadow-1);
    display: flex;
    height: 100%;
    justify-content: flex-end;
    overflow: hidden;
    transition: width 200ms ease-in;
  }
  .value {
    color: hsl(60, 20%, 25%);
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
