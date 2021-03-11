<script>
  import { blur } from "svelte/transition";

  import {
    MENU_MAIN,
    MENU_NAME,
    MENU_NEW_GAME,
    MENU_OPTIONS,
    PROP_SHADOW_0,
    PROP_SHADOW_1,
    PROP_SHADOW_2,
    PROP_SHADOW_3,
    PROP_SHADOW_INSET_1,
    PROP_SHADOW_INSET_2,
    STYLE_NONE,
    STYLE_SHADOW_0,
    STYLE_SHADOW_1,
    STYLE_SHADOW_2,
    STYLE_SHADOW_3,
    STYLE_SHADOW_INSET_1,
    STYLE_SHADOW_INSET_2,
    STYLE_TRANSPARENT,
  } from "./constants.js";
  import { initGame, options, overlay } from "./stores.js";

  let menu = MENU_MAIN;
  let playerName = $options.playerName;

  const resumeClick = () => ($overlay = false);

  const newGameClick = () => (menu = MENU_NEW_GAME);

  const optionsClick = () => (menu = MENU_OPTIONS);

  const mainMenuClick = () => (menu = MENU_MAIN);

  const initGameClick = () => initGame();

  const optionsBackClick = () => {
    menu = MENU_MAIN;
    if ($options.playerName === playerName) return;
    $options.playerName = playerName;
    initGame();
  };

  const startSubmit = (event) => {
    event.preventDefault();
    if (!playerName) return;
    menu = MENU_MAIN;
    $options.playerName = playerName;
    initGame();
  };

  $: if (playerName.length === 0 && menu === MENU_MAIN) {
    menu = MENU_NAME;
    initGame(true);
  } else {
    playerName = playerName
      .toLowerCase()
      .replace(/[^a-z0-9\@\&\$\!\?\-\+\=\.\:\/\_]/g, "");
  }

  const setShadow = (on = true) => {
    const { style: s } = document.documentElement;
    s.setProperty(PROP_SHADOW_0, on ? STYLE_SHADOW_0 : STYLE_NONE);
    s.setProperty(PROP_SHADOW_1, on ? STYLE_SHADOW_1 : STYLE_NONE);
    s.setProperty(PROP_SHADOW_2, on ? STYLE_SHADOW_2 : STYLE_NONE);
    s.setProperty(PROP_SHADOW_3, on ? STYLE_SHADOW_3 : STYLE_TRANSPARENT);
    s.setProperty(PROP_SHADOW_INSET_1, on ? STYLE_SHADOW_INSET_1 : STYLE_NONE);
    s.setProperty(PROP_SHADOW_INSET_2, on ? STYLE_SHADOW_INSET_2 : STYLE_NONE);
  };

  $: setShadow($options.shadows);
</script>

{#if menu === MENU_MAIN}
  <div class="content" in:blur={{ duration: $options.transitions ? 400 : 0 }}>
    <div class="section-1"><span class="big">digifall</span></div>
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
{:else if menu === MENU_NEW_GAME}
  <div class="content" in:blur={{ duration: $options.transitions ? 400 : 0 }}>
    <div class="section-1"><span>start a new game?</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="row">
        <button on:click={initGameClick}>yes</button>
        <button on:click={mainMenuClick}>no</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === MENU_OPTIONS}
  <div
    class="content compact"
    in:blur={{ duration: $options.transitions ? 400 : 0 }}
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
        <input type="checkbox" id="sound" bind:checked={$options.sound} />
        <label for="sound">sound fx</label>
        <input type="checkbox" id="shadows" bind:checked={$options.shadows} />
        <label for="shadows">shadows</label>
        <input
          type="checkbox"
          id="seedground"
          bind:checked={$options.seedground}
        />
        <label for="seedground">seedground</label>
        <input
          type="checkbox"
          id="transitions"
          bind:checked={$options.transitions}
        />
        <label for="transitions">transitions</label>
        <button on:click={optionsBackClick}>back</button>
      </div>
    </div>
    <div class="section-4" />
  </div>
{:else if menu === MENU_NAME}
  <div class="content">
    <div class="section-1"><span class="big">digifall</span></div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <form on:submit={startSubmit}>
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
{/if}
