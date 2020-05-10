<script>
  import { initGame, options, overlay, score } from "./stores.js";
  import Score from "./Score.svelte";

  const resumeClick = () => overlay.set(false);

  const newGameClick = () => initGame();

  const shadowClick = () => {
    const { shadow } = $options;
    const { style } = document.documentElement;
    const none = "none";
    const transparent = "0 0 0 transparent";
    const shadow0 = "0 0 1px black";
    const shadow1 =
      "0 var(--pixel-half) var(--pixel-half) var(--color-black-04), 0 -1px 0 rgba(255, 255, 255, 0.6)";
    const shadow2 =
      "0 var(--pixel) var(--pixel) var(--color-black-04), 0 -1px 0 rgba(255, 255, 255, 0.6)";
    const shadow21 = "0 0 var(--pixel-21) var(--pixel) black";
    const shadowInset1 =
      "inset 0 var(--pixel-half) var(--pixel-half) var(--color-black-04), 0 1px 0 rgba(255, 255, 255, 0.6)";
    const shadowInset2 =
      "inset 0 var(--pixel) var(--pixel) var(--color-black-04), 0 1px 0 rgba(255, 255, 255, 0.6)";
    style.setProperty("--shadow-0", shadow ? none : shadow0);
    style.setProperty("--shadow-1", shadow ? none : shadow1);
    style.setProperty("--shadow-2", shadow ? none : shadow2);
    style.setProperty("--shadow-21", shadow ? transparent : shadow21);
    style.setProperty("--shadow-inset-1", shadow ? none : shadowInset1);
    style.setProperty("--shadow-inset-2", shadow ? none : shadowInset2);
    options.set({ ...options, shadow: !shadow });
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
    <span class="score">{$score}</span>
  </div>
  <div class="section-3">
    <button on:click={resumeClick}>resume</button>
    <button on:click={newGameClick}>new game</button>
    <button on:click={shadowClick}>shadow</button>
    <button on:click={fullscreenClick}>fullscreen</button>
  </div>
  <div class="section-4" />
</div>
