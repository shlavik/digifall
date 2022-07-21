export function longpress(
  node,
  {
    duration = 400,
    checkStart = () => true,
    checkStop = () => true,
    onStart = () => true,
    onStop = () => true,
  } = {}
) {
  let timer;
  const start = (event = {}) => {
    if (!checkStart(event)) return;
    node.classList.add("longpress");
    timer = window.setTimeout(() => {
      node.dispatchEvent(new CustomEvent("longpress", { bubbles: true }));
      node.classList.remove("longpress");
    }, duration);
    onStart(event);
  };
  const stop = (event = {}) => {
    if (!checkStop(event)) return;
    node.classList.remove("longpress");
    clearTimeout(timer);
    onStop(event);
  };
  node.addEventListener("mousedown", start);
  node.addEventListener("touchstart", start);
  node.addEventListener("touchend", stop);
  window.addEventListener("mouseup", stop);
  return {
    update(newProps) {
      duration = newProps.duration || duration;
      checkStart = newProps.checkStart || checkStart;
      checkStop = newProps.checkStop || checkStop;
      onStart = newProps.onStart || onStart;
      onStop = newProps.onStop || onStop;
      stop();
    },
    destroy() {
      node.removeEventListener("mousedown", start);
      node.removeEventListener("touchstart", start);
      node.removeEventListener("touchend", stop);
      window.removeEventListener("mouseup", stop);
      stop();
    },
  };
}
