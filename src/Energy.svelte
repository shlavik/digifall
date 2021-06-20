<script>
  import { energy, randomColor } from "./stores.js";

  import { CSS_VARS } from "./constants";

  $: ({ value } = $energy);
  $: extra = value > 100;
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
  <div class="left-bar" style={leftBarStyle}>
    <span class="left-value" style={leftValueStyle}>{$energy.value}</span>
  </div>
  <div class="right-bar" style={rightBarStyle}>
    <span class="right-value" style={rightValueStyle}>{$energy.value}</span>
  </div>
</div>
