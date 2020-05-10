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
    bottom: var(--pixel-${y * 21});
    left: var(--pixel-${x * 21});
    transition-duration: ${fallPhase ? duration : 0}ms;
  `;
</script>

<style>
  .card {
    box-shadow: var(--shadow-2);
    cursor: progress;
    height: var(--pixel-21);
    letter-spacing: 0;
    position: absolute;
    transition-property: bottom;
    transition-timing-function: cubic-bezier(0.56, 0, 1, 1);
    width: var(--pixel-21);
    will-change: bottom;
  }
  .current,
  .next {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background-color: var(--color);
    box-shadow: var(--shadow-0);
    color: white;
    font-size: var(--pixel-13);
    height: var(--pixel-21);
    line-height: var(--pixel-21);
    position: absolute;
    text-align: center;
    width: var(--pixel-21);
    z-index: 1;
  }
  .current {
    clip-path: circle(100%);
    -webkit-clip-path: circle(100%);
    will-change: clip-path;
  }
  .next {
    transform: rotateY(-180deg);
  }
  .plused {
    box-shadow: none;
    perspective: var(--pixel-board);
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
    animation: blink 200ms steps(2, end) 2, fade-out 400ms ease 400ms forwards;
    box-shadow: none;
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
    from {
      clip-path: circle(100%);
      -webkit-clip-path: circle(100%);
    }
    to {
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
    <div class="current color-{value}">{value}</div>
    <div class="next color-{nextValue}">{nextValue}</div>
  </div>
</div>
