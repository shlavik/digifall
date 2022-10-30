<script>
  import { onMount } from "svelte";
  import { blur } from "svelte/transition";

  import Dialog from "./Dialog.svelte";

  import { version } from "../package.json";
  import { KEYS, OVERLAYS } from "./constants.js";
  import { options, overlay, resetGame } from "./stores.js";

  let dialogComponent = null;
  let newGameDialogOpened = false;

  onMount(() => {
    if ($options.playerName !== "") return;
    $overlay = OVERLAYS.wellcome;
  });

  export function isNewGameDialog() {
    return dialogComponent.isOpened();
  }

  export function closeNewGameDialog() {
    dialogComponent.close();
  }

  function resume() {
    $overlay = null;
  }

  function startNewGame() {
    dialogComponent.close();
    resetGame();
  }

  function showLeaderboard() {
    $overlay = OVERLAYS.leaderboard;
  }

  function showOptions() {
    $overlay = OVERLAYS.options;
  }
</script>

{#if !newGameDialogOpened}
  <div class="menu content" in:blur>
    <div class="section-1">
      <span class="big">
        digifall
        <span class="version">{version}</span>
      </span>
    </div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <button on:click={resume}>resume</button>
        <button on:click={dialogComponent.show}>new game</button>
        {#if $options[KEYS.leaderboard]}
          <button on:click={showLeaderboard}>p2p leaderboard</button>
        {/if}
        <button on:click={showOptions}>options</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
  <a
    href="https://github.com/shlavik/digifall"
    class="github-corner"
    aria-label="View source on GitHub"
    in:blur
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

<Dialog bind:this={dialogComponent} bind:opened={newGameDialogOpened}>
  <div class="col">
    <p>start a new game?</p>
    <div class="row">
      <button on:click={startNewGame}>yes</button>
      <button on:click={dialogComponent.close}>no</button>
    </div>
  </div>
</Dialog>
