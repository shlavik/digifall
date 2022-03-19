<script>
  import { PHASES } from "./constants.js";
  import { energy, phase } from "./stores.js";

  $: ({ value } = $energy);
  $: extra = value > 100;
  $: warning = value < 20 && $phase === PHASES.idle;
  $: leftBarStyle = `
    z-index: ${extra ? 0 : 1};
    flex: ${(extra ? 200 - value : value) / 100};
  `;
  $: leftValueStyle = `
    position: ${extra ? "absolute" : "relative"};
  `;
  $: rightBarStyle = `
    z-index: ${extra ? 1 : 0};
    flex: ${extra ? (value - 100) / 100 : 0};
    background-color: var(--color-${extra ? "random" : "dark"});
  `;
  $: rightValueStyle = `
    position: ${extra ? "relative" : "absolute"};
    left: ${
      extra ? `calc(${value > 119 ? 0 : (value - 120) / 100} * 128rem)` : 0
    };
  `;
</script>

<div class="energy">
  <div class="left-bar" class:warning style={leftBarStyle}>
    <span class="left-value" class:warning style={leftValueStyle}>
      {value}
    </span>
  </div>
  <div class="right-bar" style={rightBarStyle}>
    <span class="right-value" class:warning style={rightValueStyle}>
      {value}
    </span>
  </div>
</div>
