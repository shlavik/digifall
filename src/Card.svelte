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
    bottom: ${y * 21}rem;
    left: ${x * 21}rem;
    transition-duration: ${fallPhase ? duration : 0}ms;
  `;
</script>

<style>
  .card {
    box-shadow: var(--shadow-2);
    cursor: progress;
    height: 21rem;
    letter-spacing: 0;
    position: absolute;
    transition-property: bottom;
    transition-timing-function: cubic-bezier(0.56, 0, 1, 1);
    width: 21rem;
    will-change: bottom;
  }
  .current,
  .next {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background-color: var(--color);
    box-shadow: var(--shadow-0);
    color: white;
    font-size: 13rem;
    height: 21rem;
    line-height: 21rem;
    position: absolute;
    text-align: center;
    width: 21rem;
    z-index: 1;
  }
  .current {
    box-sizing: content-box;
    clip-path: circle(100%);
    -webkit-clip-path: circle(100%);
    will-change: clip-path;
  }
  .next {
    transform: rotateY(-180deg);
  }
  .plused {
    box-shadow: none;
    perspective: 128rem;
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
      border-bottom: 1px solid var(--color);
      box-shadow: var(--shadow-1);
      top: -1px;
    }
    .clickable:active .current {
      top: 0;
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
