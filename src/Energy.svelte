<script>
  import { energy } from "./stores.js";

  const getBarWidth = (value) => {
    if (value > 100) return 100;
    if (value < 0) return 0;
    return value;
  };
</script>

<div class="energy">
  <div class="bar" style={`width: ${getBarWidth($energy)}%`}>
    <span class="value">{$energy}</span>
  </div>
</div>
