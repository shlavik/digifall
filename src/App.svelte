<script>
  import { fade } from "svelte/transition";

  import Game from "./Game.svelte";
  import GameOver from "./GameOver.svelte";
  import Menu from "./Menu.svelte";

  import { COLORS, PHASES, CSS_VARS, CSS_STYLES } from "./constants.js";
  import { checkTransition } from "./core";
  import game, {
    energy,
    options,
    overlay,
    phase,
    randomColor,
  } from "./stores.js";

  onstorage = function syncTabs() {
    if (document.hasFocus()) return;
    location = location;
  };

  function updatePixelSize() {
    const { style, offsetHeight, offsetWidth } = document.documentElement;
    const ratio = offsetHeight / offsetWidth;
    const landscape = ratio < 1.5;
    const size = landscape ? offsetHeight / 192 : offsetWidth / 128;
    style.setProperty(CSS_VARS.pixel, size + "px");
    $options.landscape = landscape;
  }

  updatePixelSize();
  onresize = updatePixelSize;

  function updateRandomColor() {
    if ($phase === PHASES.idle) {
      $randomColor = COLORS.white;
      return;
    }
    const hue = Math.trunc(360 * Math.random());
    $randomColor = `hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(updateRandomColor);
  }

  energy.subscribe(({ value }) => {
    if (value > 0 && value < 101) return;
    if ($randomColor !== COLORS.white) return;
    updateRandomColor();
  });

  function setShadowStyle(
    shadows,
    cssVar,
    cssStyle,
    disabledStyle = CSS_STYLES.none
  ) {
    document.documentElement.style.setProperty(
      cssVar,
      shadows ? cssStyle : disabledStyle
    );
  }

  function updateShadowStyle(shadows) {
    [
      [CSS_VARS.gloss, CSS_STYLES.gloss],
      [CSS_VARS.glossInset, CSS_STYLES.glossInset],
      [CSS_VARS.glow, CSS_STYLES.glow],
      [CSS_VARS.shadow0, CSS_STYLES.shadow0],
      [CSS_VARS.shadow1, CSS_STYLES.shadow1],
      [CSS_VARS.shadow2, CSS_STYLES.shadow2],
      [CSS_VARS.shadow3, CSS_STYLES.shadow3, CSS_STYLES.transparent],
      [CSS_VARS.shadowInset, CSS_STYLES.shadowInset],
    ].forEach((args) => setShadowStyle(shadows, ...args));
  }

  $: updateShadowStyle(!$options.potato);
</script>

<div class="app">
  <Game />
  {#if $overlay}
    <div
      class="overlay"
      transition:fade={checkTransition(game, { duration: 200 })}
    >
      {#if $phase === PHASES.gameover}
        <GameOver />
      {:else}
        <Menu />
        <a
          href="https://github.com/shlavik/digifall"
          class="github-corner"
          aria-label="View source on GitHub"
        >
          <svg viewBox="0 0 250 250" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
            <path
              class="octo-arm"
              d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor"
            />
            <path
              class="octo-body"
              d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor"
            />
          </svg>
        </a>
      {/if}
    </div>
  {/if}
</div>
