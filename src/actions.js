export function longpress(node, { duration = 400 } = {}) {
  let timer;
  const start = (event = {}) => {
    node.dispatchEvent(
      new CustomEvent("longpressstart", { bubbles: true, detail: event })
    );
    timer = window.setTimeout(() => {
      node.dispatchEvent(
        new CustomEvent("longpressfire", { bubbles: true, detail: event })
      );
    }, duration);
  };
  const stop = (event = {}) => {
    clearTimeout(timer);
    node.dispatchEvent(
      new CustomEvent("longpressend", { bubbles: true, detail: event })
    );
  };
  node.addEventListener("mousedown", start, { passive: true });
  node.addEventListener("touchstart", start, { passive: true });
  node.addEventListener("touchend", stop, { passive: true });
  window.addEventListener("mouseup", stop, { passive: true });
  return {
    update(newProps) {
      clearTimeout(timer);
      duration = newProps.duration || duration;
    },
    destroy() {
      clearTimeout(timer);
      node.removeEventListener("mousedown", start);
      node.removeEventListener("touchstart", start);
      node.removeEventListener("touchend", stop);
      window.removeEventListener("mouseup", stop);
    },
  };
}
