<script>
  import { blur } from "svelte/transition";

  import { MENU } from "./constants.js";
  import { checkTransition, resetGame } from "./core.js";
  import game, { options, overlay } from "./stores.js";

  let menu = MENU.main;
  let playerName = $options.playerName;

  function startNewGame() {
    if (!playerName) return;
    if (!$options.playerName) $options.playerName = playerName;
    menu = MENU.main;
    resetGame(game, false);
  }

  function resumeGame() {
    $overlay = false;
  }

  function showNewGameDialog() {
    menu = MENU.newGame;
  }

  function showMainMenu() {
    menu = MENU.main;
  }

  function showOptions() {
    menu = MENU.options;
  }

  function saveOptions() {
    menu = MENU.main;
    if (playerName === $options.playerName) return;
    $options.playerName = playerName;
    resetGame(game, false);
  }

  $: if (playerName.length === 0 && menu === MENU.main) {
    menu = MENU.name;
    resetGame(game, true);
  } else {
    playerName = playerName
      .toLowerCase()
      .replace(/[^a-z0-9\@\&\$\!\?\-\+\=\.\:\/\_]/g, "");
  }
</script>

{#if menu === MENU.name}
  <div class="content">
    <div class="section-1"><span class="big">digifall</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <form on:submit|preventDefault={startNewGame}>
          <input
            type="text"
            placeholder="player name"
            maxlength="24"
            bind:value={playerName}
          />
          <button type="submit">start</button>
        </form>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === MENU.main}
  <div class="content" in:blur={checkTransition(game, { duration: 400 })}>
    <div class="section-1"><span class="big">digifall</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <button on:click={resumeGame}>resume</button>
        <button on:click={showNewGameDialog}>new game</button>
        <!-- <button on:click={optionsClick}>leaderboard</button> -->
        <button on:click={showOptions}>options</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === MENU.newGame}
  <div class="content" in:blur={checkTransition(game, { duration: 400 })}>
    <div class="section-1"><span>start a new game?</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="row">
        <button on:click={startNewGame}>yes</button>
        <button on:click={showMainMenu}>no</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === MENU.options}
  <div
    class="content compact"
    in:blur={checkTransition(game, { duration: 400 })}
  >
    <div class="section-1"><span class="big">options</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <input
          type="text"
          placeholder="player name"
          maxlength="24"
          bind:value={playerName}
        />
        <input type="checkbox" id="potato" bind:checked={$options.potato} />
        <label for="potato">potato</label>
        <input
          type="checkbox"
          id="seedground"
          disabled={!$options.landscape}
          checked={$options.landscape && $options.seedground}
          on:click={() => ($options.seedground = !$options.seedground)}
        />
        <label for="seedground">seedground</label>
        <input
          type="checkbox"
          id="transitions"
          bind:checked={$options.transitions}
        />
        <label for="transitions">transitions</label>
        <input
          type="checkbox"
          id="sound"
          disabled={!$options.transitions}
          checked={$options.transitions && $options.sound}
          on:click={() => ($options.sound = !$options.sound)}
        />
        <label for="sound">sound fx</label>
        <button on:click={saveOptions}>back</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{/if}
