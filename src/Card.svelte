<script>
  export let index;
  export let value;
  export let x = 0;
  export let y = 0;
  export let matched;
  export let plused;
  export let duration;

  function longpress(node, duration = 600) {
    let timer;
    const start = () => {
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

  $: nextValue = value < 9 ? value + 1 : 0;
  $: matt = y === 5;
  $: style = `
    bottom: ${y * 21}rem;
    left: ${x * 21}rem;
    transition-duration: ${duration}ms;
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
    <div class="current color-{value}">{value}</div>
    <div class="next color-{nextValue}">{nextValue}</div>
  </div>
</div>
