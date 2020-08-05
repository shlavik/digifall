<script>
  export let index,
    clickable,
    duration,
    fallPhase,
    matched,
    plused,
    value,
    x = 0,
    y = 0;

  $: nextValue = value < 9 ? value + 1 : 0;

  $: style = `
    bottom: ${y * 21}rem;
    left: ${x * 21}rem;
    transition-duration: ${fallPhase ? duration : 0}ms;
  `;
</script>

<div
  class="card"
  class:clickable
  class:plused
  class:matched
  {style}
  data-index={index}>
  <div class="value">
    <div class="current color-{value}">{value}</div>
    <div class="next color-{nextValue}">{nextValue}</div>
  </div>
</div>
