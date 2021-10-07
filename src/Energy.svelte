<script>
  import { CSS_VARS, PHASES } from "./constants";
  import { energy, phase, randomColor } from "./stores.js";

  $: ({ value } = $energy);
  $: extra = value > 100;
  $: warning =  value < 20 && $phase === PHASES.idle;
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
    background-color: ${extra ? $randomColor : `var(${CSS_VARS.colorDark})`};
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
      {$energy.value}
    </span>
  </div>
  <div class="right-bar" style={rightBarStyle}>
    <span class="right-value" class:warning style={rightValueStyle}>
      {$energy.value}
    </span>
  </div>
</div>
