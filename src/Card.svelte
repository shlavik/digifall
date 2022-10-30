<script>
  import { longpress } from "./actions.js";
  import { CORE } from "./constants.js";

  export let card;
  export let index;
  export let blink;
  export let focus;
  export let plus;
  export let checkStart;

  $: nextValue = card.value < 9 ? card.value + 1 : 0;
</script>

<div
  class="card"
  class:blink
  class:focus
  class:plus
  class:matt={card.y === CORE.rows - 1}
  style:--card-x={card.x}
  style:--card-y={card.y}
  style:--card-duration={card.duration}
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
