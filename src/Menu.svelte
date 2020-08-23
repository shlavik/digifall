<script>
  import { blur } from "svelte/transition";
  import { initGame, options, overlay, score } from "./stores.js";
  import { setShadow } from "./utils.js";
  import Score from "./Score.svelte";

  let isNewGameQuestionOpen = false;

  const resumeClick = () => ($overlay = false);

  const newGameClick = () => (isNewGameQuestionOpen = true);

  const yesClick = () => initGame();

  const noClick = () => (isNewGameQuestionOpen = false);

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

<div class="menu content" in:blur>
  <div class="section-1">
    {#if isNewGameQuestionOpen}
      <span in:blur>start a new game?</span>
    {:else}
      <span in:blur>work in progress</span>
    {/if}
  </div>
  <div class="section-2">
    <span class="score">{$score.value}</span>
  </div>
  <div class="section-3">
    {#if isNewGameQuestionOpen}
      <div class="row" in:blur>
        <button on:click={yesClick}>yes</button>
        <button on:click={noClick}>no</button>
      </div>
    {:else}
      <div class="col" in:blur>
        <button on:click={resumeClick}>resume</button>
        <button on:click={newGameClick}>new game</button>
        <button on:click={shadowClick}>shadow</button>
        <button on:click={fullscreenClick}>fullscreen</button>
      </div>
    {/if}
  </div>
  <div class="section-4" />
</div>
