<script>
  export let index,
    type,
    group,
    duration,
    x = 0,
    y = 0;

  const colors = [
    "gray",
    "chartreuse",
    "gold",
    "coral",
    "red",
    "fuchsia",
    "blueviolet",
    "dodgerblue",
    "cyan",
    "lightseagreen"
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
    <li>G:&nbsp;{group}</li>
  </ul>
</button>
