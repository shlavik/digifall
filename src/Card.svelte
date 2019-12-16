<script>
  export let index,
    phase,
    plused,
    matched,
    duration,
    type,
    x = 0,
    y = 0;

  $: nextType = type < 9 ? type + 1 : 0;

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
  .type0 {
    --color: gray;
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
    <div class="current type{type}">{type}</div>
    <div class="next type{nextType}">{nextType}</div>
  </div>
</div>
