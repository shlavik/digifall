<script>
  import Game from "./Game.svelte";
  import Overlay from "./Overlay.svelte";

  import { RELOAD_IN_SEC, OVERLAYS, PHASES } from "./constants.js";
  import { energy, overlay, phase, seed } from "./stores.js";

  let gameComponent = null;
  let overlayComponent = null;

  if (RELOAD_IN_SEC > 0) {
    setTimeout(() => (location = location), RELOAD_IN_SEC * 1e3);
  }

  onstorage = function syncTabs() {
    if (document.hasFocus()) return;
    document.location = document.location;
  };

  function updateRem() {
    const { style, offsetHeight, offsetWidth } = document.documentElement;
    const ratio = offsetHeight / offsetWidth;
    const landscape = ratio < 1.5;
    const size = landscape ? offsetHeight / 192 : offsetWidth / 128;
    const diff = size % 0.25;
    style.setProperty("font-size", size - diff + "px");
  }

  updateRem();
  onresize = updateRem;
  document.addEventListener("visibilitychange", updateRem);

  function manageRandomColorClass(value) {
    document.documentElement.classList[value ? "add" : "remove"](
      "random-color",
    );
  }

  $: if ($phase === PHASES.gameOver) $overlay = OVERLAYS.gameOver;
  $: manageRandomColorClass(
    $energy.value > 100 ||
      $phase === PHASES.extra ||
      $phase === PHASES.combo ||
      $overlay === OVERLAYS.leaderboard ||
      $overlay === OVERLAYS.gameOver,
  );

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
        if ($overlay === OVERLAYS.gameOver) return;
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
