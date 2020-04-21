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
    transition-duration: ${fallPhase ? duration : 0}ms;
    left: var(--pixel-${x * 21});
    bottom: var(--pixel-${y * 21});
  `;
</script>

<style>
  .card {
    box-shadow: var(--shadow-2);
    height: var(--pixel-21);
    letter-spacing: 0;
    position: absolute;
    transition-property: bottom;
    transition-timing-function: cubic-bezier(.56, 0, 1, 1);
    width: var(--pixel-21);
    will-change: bottom;
  }
  .current,
  .next {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background-color: var(--color);
    color: white;
    font-size: var(--pixel-13);
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
    box-shadow: none;
    perspective: var(--game-width);
    z-index: 2;
  }
  .plused .value {
    transform-style: preserve-3d;
    transform: rotateY(-180deg);
    transition: transform 400ms ease;
  }
  .plused .current,
  .plused .next {
    box-shadow: var(--shadow-1);
  }
  .matched {
    box-shadow: none;
  }
  .matched .current {
    animation: blink 150ms steps(3, end) 2, fade-out 300ms ease 300ms;
  }
  .value-0 {
    --color: hsl(60, 20%, 40%);
  }
  .value-1 {
    --color: hsl(90, 100%, 55%);
  }
  .value-2 {
    --color: hsl(48, 100%, 50%);
  }
  .value-3 {
    --color: hsl(32, 100%, 50%);
  }
  .value-4 {
    --color: hsl(4, 100%, 55%);
  }
  .value-5 {
    --color: hsl(334, 100%, 65%);
  }
  .value-6 {
    --color: hsl(296, 100%, 40%);
  }
  .value-7 {
    --color: hsl(248, 100%, 60%);
  }
  .value-8 {
    --color: hsl(206, 100%, 55%);
  }
  .value-9 {
    --color: hsl(164, 100%, 45%);
  }
  @media (hover: hover) and (pointer: fine) {
    .clickable:hover {
      box-shadow: none;
      cursor: pointer;
      z-index: 2;
    }
    .clickable:hover .current,
    .clickable:hover .next {
      box-shadow: var(--shadow-1);
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
  @keyframes fade-out {
    0% {
      clip-path: circle(100%);
      -webkit-clip-path: circle(100%);
    }
    100% {
      clip-path: circle(0);
      -webkit-clip-path: circle(0);
    }
  }
</style>

<div
  class="card"
  class:clickable
  class:plused
  class:matched
  {style}
  data-index={index}>
  <div class="value">
    <div class="current value-{value}">{value}</div>
    <div class="next value-{nextValue}">{nextValue}</div>
  </div>
</div>
