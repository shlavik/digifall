<script>
  import { getNextCardValue } from "./core.js";

  export let card;
  export let index;
  export let blink;
  export let focus;
  export let longpress;
  export let plus;

  $: nextValue = getNextCardValue(card.value);
</script>

<div
  class="card"
  class:blink
  class:focus
  class:longpress
  class:plus
  style:--card-x={card.x}
  style:--card-y={card.y}
  style:--card-duration={card.duration}
  data-index={index}
>
  <div class="value">
    <div
      class="current"
      class:cluster-top={card.cluster && card.cluster.top}
      class:cluster-right={card.cluster && card.cluster.right}
      class:cluster-bottom={card.cluster && card.cluster.bottom}
      class:cluster-left={card.cluster && card.cluster.left}
      style:--color="var(--color-{card.value})"
    >
      {card.value}
    </div>
    <div class="next" style:--color="var(--color-{nextValue})">
      {nextValue}
    </div>
  </div>
</div>
