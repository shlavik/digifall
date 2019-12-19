<script>
  export let index,
    phase,
    plused,
    matched,
    duration,
    value,
    x = 0,
    y = 0;

  $: nextType = value < 9 ? value + 1 : 0;

  $: style = `
    transition: bottom ${phase === "fall" ? duration : 0}ms ease-in;
    left: calc(${x} * var(--card-size));
    bottom: calc(${y} * var(--card-size));
  `;
</script>

<style>
  .card {
    box-shadow: var(--shadow-2);
    height: var(--card-size);
    position: absolute;
    width: var(--card-size);
  }
  .card:hover {
    box-shadow: var(--shadow-1);
    cursor: pointer;
    z-index: 2;
  }
  .current,
  .next {
    backface-visibility: hidden;
    background-color: var(--color);
    color: white;
    font-size: var(--pixel-10);
    height: var(--card-size);
    line-height: var(--card-size);
    position: absolute;
    text-align: center;
    width: var(--card-size);
    z-index: 1;
  }
  .next {
    transform: rotateY(-180deg);
  }
  .plused {
    box-shadow: var(--shadow-1);
    perspective: var(--game-width);
    z-index: 2;
  }
  .plused .value {
    transform-style: preserve-3d;
    transform: rotateY(-180deg);
    transition: transform 400ms ease;
  }
  .matched .current {
    animation: blink 100ms infinite;
  }
  .value0 {
    --color: gray;
  }
  .value1 {
    --color: lawngreen;
  }
  .value2 {
    --color: gold;
  }
  .value3 {
    --color: darkorange;
  }
  .value4 {
    --color: crimson;
  }
  .value5 {
    --color: fuchsia;
  }
  .value6 {
    --color: blueviolet;
  }
  .value7 {
    --color: dodgerblue;
  }
  .value8 {
    --color: turquoise;
  }
  .value9 {
    --color: mediumseagreen;
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

<div class="card" class:plused class:matched {style} data-index={index}>
  <div class="value">
    <div class="current value{value}">{value}</div>
    <div class="next value{nextType}">{nextType}</div>
  </div>
</div>
