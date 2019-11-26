<script>
  export let index,
    duration,
    matched,
    phase,
    type,
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
    background-color: ${matched ? "white" : colors[type]};
    animation: blink .1s steps(1) infinite;
    transition: bottom ${phase === "fall" ? duration : 0}ms ease-in;
    left: calc(${x} * var(--block-size));
    bottom: calc(${y} * var(--block-size));
  `;
</script>

<button class="btn waves-effect waves-light block" {style} name={index}>
  <span class="value">{type}</span>
</button>
