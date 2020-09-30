<script>
  import { blur } from "svelte/transition";
  import { initGame, options, overlay } from "./stores.js";

  let kind = "main";
  let playerName = $options.playerName;

  const resumeClick = () => ($overlay = false);

  const newGameClick = () => (kind = "new game");

  const optionsClick = () => (kind = "options");

  const mainMenuClick = () => (kind = "main");

  const optionsBackClick = () => {
    if ($options.playerName !== playerName) {
      $options.playerName = playerName;
      initGame();
    }
    mainMenuClick();
  };

  const continueClick = () => {
    if (!playerName) return;
    $options.playerName = playerName;
    $overlay = false;
    mainMenuClick();
  };

  $: if (playerName === "" && kind === "main") {
    kind = "name";
    $overlay = true;
  }

  const playerNameKeydown = (event) => {
    if (!event.key.match(/[A-Za-z0-9@&$!_\?\.\-]/)) event.preventDefault();
  };

  const playerNameChange = () => (playerName = playerName.toLowerCase());

  const setShadow = (on = true) => {
    const { style } = document.documentElement;
    const none = "none";
    const transparent = "0 0 0 transparent";
    const shadow0 = "0 0 1px black";
    const shadow1 = "0 0.5rem 0.5rem var(--color-black-04), 0 -1px 0 white";
    const shadow2 = "0 1rem 1rem var(--color-black-04),  0 -1px 0 white";
    const shadow11 = "0 0 11rem 1rem black";
    const shadowInset1 =
      "inset 0 0.5rem 0.5rem var(--color-black-04), 0 1px 0 white";
    const shadowInset2 =
      "inset 0 1rem 1rem var(--color-black-04), 0 1px 0 white";
    const shadowGithub = "0 0 5rem black";
    style.setProperty("--shadow-0", on ? shadow0 : none);
    style.setProperty("--shadow-1", on ? shadow1 : none);
    style.setProperty("--shadow-2", on ? shadow2 : none);
    style.setProperty("--shadow-11", on ? shadow11 : transparent);
    style.setProperty("--shadow-inset-1", on ? shadowInset1 : none);
    style.setProperty("--shadow-inset-2", on ? shadowInset2 : none);
    style.setProperty("--shadow-github", on ? shadowGithub : none);
  };

  $: setShadow($options.shadows);
</script>

{#if kind === 'main'}
  <div
    class="menu content"
    in:blur={{ duration: $options.transitions ? 400 : 0 }}>
    <div class="section-1"><span>work in progress</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <button on:click={resumeClick}>resume</button>
        <button on:click={newGameClick}>new game</button>
        <!-- <button on:click={optionsClick}>leaderboard</button> -->
        <button on:click={optionsClick}>options</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if kind === 'new game'}
  <div
    class="menu content"
    in:blur={{ duration: $options.transitions ? 400 : 0 }}>
    <div class="section-1"><span>start a new game?</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="row">
        <button on:click={initGame}>yes</button>
        <button on:click={mainMenuClick}>no</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if kind === 'options'}
  <div
    class="menu content"
    in:blur={{ duration: $options.transitions ? 400 : 0 }}>
    <div class="section-1"><span>options</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <input
          type="text"
          placeholder="player name"
          maxlength="24"
          on:keydown={playerNameKeydown}
          on:change={playerNameChange}
          bind:value={playerName} />
        <input type="checkbox" id="shadows" bind:checked={$options.shadows} />
        <label for="shadows">shadows</label>
        <input
          type="checkbox"
          id="seedground"
          bind:checked={$options.seedground} />
        <label for="seedground">seedground</label>
        <input
          type="checkbox"
          id="transitions"
          bind:checked={$options.transitions} />
        <label for="transitions">transitions</label>
        <button on:click={optionsBackClick}>back</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if kind === 'name'}
  <div class="menu content">
    <div class="section-1"><span>work in progress</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <input
          type="text"
          placeholder="player name"
          maxlength="24"
          on:keydown={playerNameKeydown}
          on:change={playerNameChange}
          bind:value={playerName} />
        <button on:click={continueClick}>continue</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{/if}
