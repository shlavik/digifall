<script>
  import { energy } from "./stores.js";
</script>

<div class="energy">
  <div class="bar" style={`width: ${$energy}%`}>
    <span class="value">{$energy}</span>
  </div>
</div>
