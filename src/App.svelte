<script>
  import { onMount } from "svelte";
  import { energy, overlay, phase } from "./stores.js";
  import { getNewAppStyle, setShadow } from "./utils.js";
  import Game from "./Game.svelte";
  import GameOver from "./GameOver.svelte";
  import Menu from "./Menu.svelte";
  import Overlay from "./Overlay.svelte";

  let appStyle = getNewAppStyle();

  const updateAppStyle = () => {
    const { style } = document.documentElement;
    const { offsetHeight, offsetWidth } = document.querySelector(".app");
    if (offsetHeight / offsetWidth > 1.5) {
      style.setProperty("--pixel", `${offsetWidth / 128}px`);
      appStyle = undefined;
    } else {
      style.setProperty("--pixel", `${offsetHeight / 192}px`);
      appStyle = getNewAppStyle();
    }
  };

  onMount(() => {
    updateAppStyle();
    setShadow();
  });

  onresize = updateAppStyle;

  // DELME
  onkeydown = ({ key }) => {
    if (key === "1") $energy = { buffer: 0, value: 10 };
    else if (key === "0") $energy = { buffer: 0, value: 100 };
    else if (key === "ArrowRight") $energy = { ...$energy, buffer: 1 };
    else if (key === "ArrowLeft") $energy = { ...$energy, buffer: -1 };
  };
</script>

<div class="app" style={appStyle}>
  <Game />
  {#if $overlay}
    <Overlay>
      {#if $phase === 'gameover'}
        <GameOver />
      {:else}
        <Menu />
      {/if}
    </Overlay>
  {/if}
</div>
