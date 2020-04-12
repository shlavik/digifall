<script>
  import { overlay } from "./stores.js";

  const handleStartClick = () => overlay.set(false);

  const handleFullscreenClick = () => {
    const { documentElement, fullscreen } = document;
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      documentElement.requestFullscreen();
    }
  };
</script>

<style>
  .menu {
  }
</style>

<div class="menu content">
  <button on:click={handleStartClick}>Resume</button>
  <button on:click={handleFullscreenClick}>Fullscreen</button>
</div>
