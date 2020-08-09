<script>
  import { energy, overlay, phase } from "./stores.js";
  import Game from "./Game.svelte";
  import GameOver from "./GameOver.svelte";
  import Menu from "./Menu.svelte";
  import Overlay from "./Overlay.svelte";

  // DELME
  onkeydown = ({ key }) => {
    if (key === "1") $energy = { buffer: 0, value: 10 };
    else if (key === "0") $energy = { buffer: 0, value: 100 };
    else if (key === "ArrowRight") $energy = { ...$energy, buffer: 1 };
    else if (key === "ArrowLeft") $energy = { ...$energy, buffer: -1 };
  };
</script>

<div class="app">
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
