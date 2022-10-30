<script>
  import Game from "./Game.svelte";
  import Overlay from "./Overlay.svelte";

  import { COLORS, OVERLAYS, PHASES } from "./constants.js";
  import { energy, overlay, phase, randomColor, seed } from "./stores.js";

  let gameComponent = null;
  let overlayComponent = null;

  /**
   * Reloading page 1 time in day just in case
   */
  setTimeout(() => (location = location), 86400000);

  onstorage = function syncTabs() {
    if (document.hasFocus()) return;
    document.location = document.location;
  };

  function updatePixelSize() {
    const { style, offsetHeight, offsetWidth } = document.documentElement;
    const ratio = offsetHeight / offsetWidth;
    const landscape = ratio < 1.5;
    const size = landscape ? offsetHeight / 192 : offsetWidth / 128;
    const diff = size % 0.25;
    style.setProperty("--pixel", size - diff + "px");
  }

  updatePixelSize();
  onresize = updatePixelSize;
  document.addEventListener("visibilitychange", updatePixelSize);

  function updateRandomColor() {
    if ($phase === PHASES.idle) return ($randomColor = COLORS.white);
    const hue = Math.trunc(360 * Math.random());
    $randomColor = `hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(updateRandomColor);
  }

  $: if ($energy.value < 1 || $energy.value > 100) updateRandomColor();
  $: document.documentElement.style.setProperty("--color-random", $randomColor);
  $: if ($phase === PHASES.gameover) $overlay = OVERLAYS.gameover;

  function keydown(event) {
    const component = $overlay === null ? gameComponent : overlayComponent;
    switch (event.code) {
      case "Escape":
        event.preventDefault();
        return component.blur();
      case "Tab":
        event.preventDefault();
        if (!$seed) return;
        if ($overlay === OVERLAYS.wellcome) return;
        if ($overlay === OVERLAYS.gameover) return;
        return overlayComponent.switchOverlay();
      case "ArrowUp":
        return component.moveUp();
      case "ArrowDown":
        return component.moveDown();
      case "ArrowLeft":
        return component.moveLeft();
      case "ArrowRight":
        return component.moveRight();
      case "Enter":
      case "Space":
      case "KeyF":
      case "KeyJ":
        return component.perfomAction();
    }
  }
</script>

<svelte:window on:keydown={keydown} />

<div class="app">
  <Game bind:this={gameComponent} />
  <Overlay bind:this={overlayComponent} />
</div>
