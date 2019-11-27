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
    background-color: darkslategray;
    flex-basis: var(--pixel-9);
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
    font-size: var(--pixel-7);
    line-height: 1;
  }
</style>

<div class="energy">
  <div class="bar" style={`width: ${getBarWidth($energy)}%`}>
    <span class="value">{$energy}</span>
  </div>
</div>
