<script>
  import { longpress } from "./actions.js";

  export let card;
  export let index;
  export let blink;
  export let plus;
  export let checkStart;

  $: nextValue = card.value < 9 ? card.value + 1 : 0;
</script>

<div
  class="card"
  class:blink
  class:plus
  class:matt={card.y === 5}
  style:bottom={21 * card.y + "rem"}
  style:left={21 * card.x + "rem"}
  style:transition-duration={card.duration + "ms"}
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
