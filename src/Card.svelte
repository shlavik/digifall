<script>
  import { longpress } from "./actions.js";

  export let card;
  export let blink;
  export let cluster;
  export let focus;
  export let index;
  export let plus;
  export let checkStart;
</script>

<div
  class="card"
  class:blink
  class:cluster
  class:focus
  class:plus
  style:--card-x={card.x}
  style:--card-y={card.y}
  style:--card-duration={card.duration}
  data-index={index}
  use:longpress={{ checkStart }}
>
  <div class="value">
    <div
      class="current"
      class:cluster-top={card.cluster?.top}
      class:cluster-right={card.cluster?.right}
      class:cluster-bottom={card.cluster?.bottom}
      class:cluster-left={card.cluster?.left}
      style:--color="var(--color-{card.value})"
    >
      {card.value}
    </div>
    <div class="next" style:--color="var(--color-{card.nextValue})">
      {card.nextValue}
    </div>
  </div>
</div>
