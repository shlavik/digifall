<script>
  import { initGame, options, overlay, score } from "./stores.js";
  import { setShadow } from "./utils.js";
  import Score from "./Score.svelte";

  const resumeClick = () => ($overlay = false);

  const newGameClick = () => initGame();

  const shadowClick = () => {
    const { shadow } = $options;
    setShadow(!shadow);
    $options = { ...$options, shadow: !shadow };
  };

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
  <div class="section-1">
    <span class="text-small">work in progress</span>
  </div>
  <div class="section-2">
    <span class="score">{$score.value}</span>
  </div>
  <div class="section-3">
    <button on:click={resumeClick}>resume</button>
    <button on:click={newGameClick}>new game</button>
    <button on:click={shadowClick}>shadow</button>
    <button on:click={fullscreenClick}>fullscreen</button>
  </div>
  <div class="section-4" />
</div>
