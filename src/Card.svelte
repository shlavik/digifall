<script>
  import { longpress } from "./actions.js";
  import { PHASES } from "./constants.js";
  import { options, phase, plusIndex } from "./stores.js";

  export let card;
  export let index;
  export let matched;

  function checkStart() {
    return (
      $options.speedrun !== true &&
      $phase === PHASES.idle &&
      $plusIndex === undefined
    );
  }

  $: matt = card.y === 5;
  $: plused = $plusIndex === index;
  $: nextValue = card.value < 9 ? card.value + 1 : 0;
  $: style = `
    bottom: ${card.y * 21}rem;
    left: ${card.x * 21}rem;
    transition-duration: ${card.duration}ms;
  `;
</script>

<div
  class="card"
  class:matched
  class:matt
  class:plused
  {style}
  data-index={index}
  use:longpress={{ checkStart }}
>
  <div class="value">
    <div class="current" style:--color="var(--color-{card.value})">
      {card.value}
    </div>
    <div class="next" style:--color="var(--color-{nextValue})">
      {nextValue}
    </div>
  </div>
</div>
