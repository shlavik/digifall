<script>
  export let index,
    type,
    duration,
    x = 0,
    y = 0;

  const colors = [
    "dimgray",
    "lawngreen",
    "gold",
    "darkorange",
    "crimson",
    "fuchsia",
    "blueviolet",
    "dodgerblue",
    "turquoise",
    "mediumseagreen"
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
