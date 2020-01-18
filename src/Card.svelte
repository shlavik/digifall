<script>
  export let index,
    phase,
    plused,
    matched,
    duration,
    value,
    x = 0,
    y = 0;

  $: nextValue = value < 9 ? value + 1 : 0;

  $: style = `
    transition-duration: ${phase === "fall" ? duration : 0}ms;
    left: calc(${x} * var(--pixel-21));
    bottom: calc(${y} * var(--pixel-21));
  `;
</script>

<style>
  .card {
    box-shadow: var(--shadow-2);
    height: var(--pixel-21);
    position: absolute;
    transition-property: bottom;
    transition-timing-function: cubic-bezier(0.56, 0, 1, 1);
    width: var(--pixel-21);
    will-change: bottom;
  }
  .current,
  .next {
    backface-visibility: hidden;
    background-color: var(--color);
    color: white;
    font-size: var(--pixel-10);
    height: var(--pixel-21);
    line-height: var(--pixel-21);
    position: absolute;
    text-align: center;
    width: var(--pixel-21);
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
    animation: blink 150ms steps(3, end) 2;
  }
  .value0 {
    --color: hsl(60, 20%, 40%);
  }
  .value1 {
    --color: hsl(90, 100%, 55%);
  }
  .value2 {
    --color: hsl(48, 100%, 50%);
  }
  .value3 {
    --color: hsl(32, 100%, 50%);
  }
  .value4 {
    --color: hsl(4, 100%, 55%);
  }
  .value5 {
    --color: hsl(334, 100%, 65%);
  }
  .value6 {
    --color: hsl(296, 100%, 40%);
  }
  .value7 {
    --color: hsl(248, 100%, 60%);
  }
  .value8 {
    --color: hsl(206, 100%, 55%);
  }
  .value9 {
    --color: hsl(164, 100%, 45%);
  }
  @media (min-aspect-ratio: 2/3) {
    .card:hover {
      box-shadow: var(--shadow-1);
      cursor: pointer;
      z-index: 2;
    }
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
    <div class="next value{nextValue}">{nextValue}</div>
  </div>
</div>
