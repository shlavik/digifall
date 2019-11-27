<script>
  export let index,
    duration,
    matched,
    phase,
    type,
    x = 0,
    y = 0;

  $: style = `
    transition: bottom ${phase === "fall" ? duration : 0}ms ease-in;
    left: calc(${x} * var(--block-size));
    bottom: calc(${y} * var(--block-size));
  `;
</script>

<style>
  .block {
    background-color: var(--color);
    box-shadow: none;
    color: white;
    font-size: var(--pixel-10);
    height: var(--block-size);
    line-height: 1;
    padding: 0;
    position: absolute;
    width: var(--block-size);
  }
  .block:hover {
    /* transform: rotateY(180deg); */
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -1px rgba(0, 0, 0, 0.2);
    z-index: 100;
  }
  .block:hover:active {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
  .type0 {
    --color: dimgray;
  }
  .type1 {
    --color: lawngreen;
  }
  .type2 {
    --color: gold;
  }
  .type3 {
    --color: darkorange;
  }
  .type4 {
    --color: crimson;
  }
  .type5 {
    --color: fuchsia;
  }
  .type6 {
    --color: blueviolet;
  }
  .type7 {
    --color: dodgerblue;
  }
  .type8 {
    --color: turquoise;
  }
  .type9 {
    --color: mediumseagreen;
  }
  .matched {
    animation: blink 200ms infinite;
  }
  @keyframes blink {
    from {
      background-color: white;
    }
    to {
      background-color: var(--color);
    }
  }
</style>

<button class="block type{type}" class:matched {style} name={index}>
  <span class="value">{type}</span>
</button>
