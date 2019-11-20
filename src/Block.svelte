<script>
  export let index,
    type,
    duration,
    x = 0,
    y = 0;
  // LightSlateGrey
  const colors = [
    "DimGray",
    "LawnGreen",
    "Gold",
    "DarkOrange",
    "Crimson",
    "Fuchsia",
    "BlueViolet",
    "DodgerBlue",
    "Turquoise",
    "MediumSeaGreen"
  ];

  $: style = `
    background-color: ${colors[type]};
    transition: all ${duration}ms ease-in;
    left: calc(${x} * var(--block-size));
    bottom: calc(${y} * var(--block-size));
  `;
</script>

<button class="btn waves-effect waves-light block" {style} name={index}>
  <ul>
    <li>I:&nbsp;{index}</li>
    <li>T:&nbsp;{type}</li>
  </ul>
</button>
