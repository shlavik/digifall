<script>
  import { blur, fly } from "svelte/transition";

  import Dialog from "./Dialog.svelte";
  import PlayerName from "./PlayerName.svelte";

  import { INITIAL_VALUES, OVERLAYS } from "./constants.js";
  import { options, overlay, records, resetGame } from "./stores.js";

  let dialogComponent = null;
  let dialogOpened = false;

  let playerNameComponent = null;
  let playerName = $options.playerName;

  export function isDialogOpened() {
    return dialogOpened;
  }

  function accept() {
    dialogComponent.close();
    $records = INITIAL_VALUES.records;
    resetGame(playerName);
  }

  function reject() {
    dialogComponent.close();
    playerName = $options.playerName;
  }

  function submit() {
    if (playerName === "") return playerNameComponent.blink();
    if (playerName === $options.playerName) return ($overlay = OVERLAYS.menu);
    dialogComponent.show();
  }
</script>

{#if !dialogOpened}
  <form
    class="options content"
    in:blur|global
    on:submit|preventDefault={submit}
  >
    <div class="section-1">
      <span in:fly|global={{ y: -48 }}>options</span>
    </div>
    <div class="section-2" />
    <div class="section-3" in:fly|global={{ y: 24 }}>
      <div class="col">
        <PlayerName bind:this={playerNameComponent} bind:playerName />
        <input
          type="checkbox"
          id="leaderboard"
          bind:checked={$options.leaderboard}
        />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label
          for="leaderboard"
          title="sharing records {$options.leaderboard
            ? 'enabled'
            : 'disabled'}"
          tabindex="0"
          role="button"
        >
          p2p leaderboard
        </label>
        <input type="checkbox" id="rapid" bind:checked={$options.rapid} />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label
          for="rapid"
          title="boring animations {$options.rapid ? 'disabled' : 'enabled'}"
          tabindex="0"
          role="button">rapid mode</label
        >
        <input
          type="checkbox"
          id="sound"
          checked={$options.sound}
          on:click={() => ($options.sound = !$options.sound)}
        />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label
          for="sound"
          title="making sounds {$options.sound ? 'enabled' : 'disabled'}"
          tabindex="0"
          role="button">sound effects</label
        >
      </div>
    </div>
    <div class="section-4">
      <div class="col">
        <button type="submit" title="[open menu]" in:fly|global={{ y: 48 }}>
          return
        </button>
      </div>
    </div>
  </form>
{/if}

<Dialog
  title={playerName}
  bind:this={dialogComponent}
  bind:opened={dialogOpened}
>
  <div class="col exclam-fix">
    <p>new name detected!</p>
    <p>progress will be lost!</p>
    <div class="row">
      <button on:click={accept}>accept</button>
      <button on:click={reject}>reject</button>
    </div>
  </div>
</Dialog>
