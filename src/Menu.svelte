<script>
  import { blur } from "svelte/transition";

  import Leaderboard from "./Leaderboard.svelte";

  import { KEYS } from "./constants.js";
  import { checkTransition, options, overlay, resetGame } from "./stores.js";

  const menus = {
    leaderboard: "leaderboard",
    main: "main",
    name: "name",
    newGame: "new game",
    options: "options",
  };

  const duration = 400;
  let menu = menus.main;
  let playerName = $options.playerName;

  function startNewGame() {
    if (!playerName) return;
    if (!$options.playerName) $options.playerName = playerName;
    resetGame(false);
    setTimeout(() => (menu = menus.main), duration);
  }

  function resumeGame() {
    $overlay = false;
  }

  function showNewGameDialog() {
    menu = menus.newGame;
  }

  function showLeaderboard() {
    menu = menus.leaderboard;
  }

  function showMainMenu() {
    menu = menus.main;
  }

  function showOptions() {
    menu = menus.options;
  }

  function saveOptions() {
    menu = menus.main;
    if (playerName === $options.playerName) return;
    $options.playerName = playerName;
    resetGame(false);
  }

  function checkbox(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const { parentNode, htmlFor } = event.target;
    parentNode.querySelector("#" + htmlFor).click();
  }

  $: if (playerName.length === 0 && menu === menus.main) {
    menu = menus.name;
    resetGame(true);
  } else {
    playerName = playerName
      .toLowerCase()
      .replace(/[^a-z0-9\@\&\$\!\?\-\+\=\.\:\/\_]/g, "");
  }
  $: playerNameTitle = ('PLAYER NAME: "' + playerName + '"').toUpperCase();
</script>

{#if menu === menus.name}
  <div class="content" in:blur={checkTransition({ duration })}>
    <div class="section-1"><span class="big">digifall</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <form on:submit|preventDefault={startNewGame}>
          <input
            type="text"
            placeholder="player name"
            title={playerNameTitle}
            maxlength="42"
            bind:value={playerName}
          />
          <button type="submit">start</button>
        </form>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === menus.main}
  <div class="content" in:blur={checkTransition({ duration })}>
    <div class="section-1"><span class="big">digifall</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <button on:click={resumeGame}>resume</button>
        <button on:click={showNewGameDialog}>new game</button>
        {#if $options[KEYS.leaderboard]}
          <button on:click={showLeaderboard}>p2p leaderboard</button>
        {/if}
        <button on:click={showOptions}>options</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === menus.newGame}
  <div class="content" in:blur={checkTransition({ duration })}>
    <div class="section-1" />
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <span>start a new game?</span>
        <div class="row">
          <button on:click={startNewGame}>yes</button>
          <button on:click={showMainMenu}>no</button>
        </div>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === menus.leaderboard}
  <div class="content" in:blur={checkTransition({ duration })}>
    <Leaderboard>
      <button title="RETURN TO MAIN MENU" on:click={saveOptions}>
        main menu
      </button>
    </Leaderboard>
  </div>
{:else if menu === menus.options}
  <div class="content" in:blur={checkTransition({ duration })}>
    <div class="section-1"><span>options</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <input
          type="text"
          placeholder="player name"
          title={playerNameTitle}
          maxlength="42"
          bind:value={playerName}
        />
        <input
          type="checkbox"
          id="leaderboard"
          bind:checked={$options.leaderboard}
        />
        <label for="leaderboard" tabindex="0" on:keydown={checkbox}>
          p2p leaderboard
        </label>
        <input type="checkbox" id="potato" bind:checked={$options.potato} />
        <label for="potato" tabindex="0" on:keydown={checkbox}>potato</label>
        <input
          type="checkbox"
          id="seedground"
          disabled={!$options.landscape}
          checked={$options.landscape && $options.seedground}
          on:click={() => ($options.seedground = !$options.seedground)}
        />
        <label for="seedground" tabindex="0" on:keydown={checkbox}>
          seedground
        </label>
        <input
          type="checkbox"
          id="transitions"
          bind:checked={$options.transitions}
        />
        <label for="transitions" tabindex="0" on:keydown={checkbox}>
          transitions
        </label>
        <input
          type="checkbox"
          id="sound"
          disabled={!$options.transitions}
          checked={$options.transitions && $options.sound}
          on:click={() => ($options.sound = !$options.sound)}
        />
        <label for="sound" tabindex="0" on:keydown={checkbox}>
          sound effects
        </label>
      </div>
    </div>
    <div class="section-4">
      <div class="col">
        <button title="RETURN TO MAIN MENU" on:click={saveOptions}>
          main menu
        </button>
      </div>
    </div>
  </div>
{/if}
