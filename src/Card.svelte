<script>
  import { PHASES } from "./constants.js";
  import { matchedIndexes, phase, plusIndex } from "./stores.js";

  export let blink;
  export let card;
  export let index;

  function longpress(node, duration = 600) {
    let timer;
    const start = () => {
      if ($phase !== PHASES.idle || $plusIndex !== undefined) return;
      node.classList.add("longpress");
      timer = window.setTimeout(() => {
        node.dispatchEvent(new CustomEvent("longpress", { bubbles: true }));
        node.classList.remove("longpress");
      }, duration);
    };
    const stop = () => {
      node.classList.remove("longpress");
      clearTimeout(timer);
    };
    node.addEventListener("mousedown", start);
    node.addEventListener("touchstart", start);
    node.addEventListener("touchend", stop);
    window.addEventListener("mouseup", stop);
    return {
      update(newDuration) {
        stop();
        duration = newDuration;
      },
      destroy() {
        stop();
        node.removeEventListener("mousedown", start);
        node.removeEventListener("touchstart", start);
        node.removeEventListener("touchend", stop);
        window.removeEventListener("mouseup", stop);
      },
    };
  }

  $: matched = $matchedIndexes.includes(index);
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
  use:longpress
>
  <div class="value">
    <div class="current color-{card.value}">{card.value}</div>
    <div class="next color-{nextValue}">{nextValue}</div>
  </div>
</div>
