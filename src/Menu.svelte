<script>
  import { overlay, initGame } from "./stores.js";

  const resumeClick = () => overlay.set(false);

  const newGameClick = () => initGame();

  const fullscreenClick = () => {
    const { documentElement, fullscreen } = document;
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      documentElement.requestFullscreen();
    }
  };
</script>

<div class="menu content">
  <button on:click={resumeClick}>resume</button>
  <button on:click={newGameClick}>new game</button>
  <button on:click={fullscreenClick}>fullscreen</button>
</div>
