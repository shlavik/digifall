<script>
  import { blur, fly } from "svelte/transition";

  import Dialog from "./Dialog.svelte";
  import PlayerName from "./PlayerName.svelte";

  import { INITIAL_VALUES, KEYS, OVERLAYS } from "./constants.js";
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
  <form class="options content" in:blur on:submit|preventDefault={submit}>
    <div class="section-1">
      <span in:fly={{ y: -48 }}>options</span>
    </div>
    <div class="section-2" />
    <div class="section-3" in:fly={{ y: 24 }}>
      <div class="col">
        <PlayerName bind:this={playerNameComponent} bind:playerName />
        <input
          type="checkbox"
          id="leaderboard"
          bind:checked={$options.leaderboard}
        />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label for="leaderboard" tabindex="0" role="button">
          p2p leaderboard
        </label>
        <input type="checkbox" id="cluster" bind:checked={$options.cluster} />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label for="cluster" tabindex="0" role="button">cluster corners</label>
        <input type="checkbox" id="speedrun" bind:checked={$options.speedrun} />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label for="speedrun" tabindex="0" role="button">speedrun mode</label>
        <input
          type="checkbox"
          id="sound"
          disabled={$options.speedrun}
          checked={!$options.speedrun && $options.sound}
          on:click={() => ($options.sound = !$options.sound)}
        />
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label for="sound" tabindex="0" role="button">sound effects</label>
      </div>
    </div>
    <div class="section-4">
      <div class="col">
        <button type="submit" title="RETURN TO MAIN MENU" in:fly={{ y: 48 }}>
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
