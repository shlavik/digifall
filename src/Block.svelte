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
    height: var(--block-size);
    position: absolute;
    width: var(--block-size);
  }
  .block:hover {
    /* transform: rotateY(180deg); */
    cursor: pointer;
    z-index: 2;
  }
  .block:before {
    box-shadow: var(--shadow-2);
    content: "";
    display: block;
    height: var(--block-size);
    position: absolute;
    width: var(--block-size);
  }
  .block:hover:before {
    box-shadow: var(--shadow-1);
  }
  .block:active:before {
    box-shadow: none;
  }
  .block:after {
    background-color: var(--color);
    content: "";
    display: block;
    height: var(--block-size);
    position: absolute;
    top: 0;
    width: var(--block-size);
    z-index: 1;
  }
  .value {
    color: white;
    font-size: var(--pixel-10);
    line-height: var(--block-size);
    position: absolute;
    text-align: center;
    width: 100%;
    z-index: 2;
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
  .matched:after {
    animation: blink 200ms infinite;
  }
  @keyframes blink {
    from {
      background-color: white;
      color: var(--color);
    }
    to {
      background-color: var(--color);
      color: white;
    }
  }
</style>

<div class="block type{type}" class:matched {style} data-index={index}>
  <span class="value">{type}</span>
</div>
