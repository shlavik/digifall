<script>
  import { blur } from "svelte/transition";

  import Dialog from "./Dialog.svelte";
  import PlayerName from "./PlayerName.svelte";

  import { options, overlay, timestamp } from "./stores.js";

  let dialogComponent = null;
  let dialogOpened = true;

  let playerNameComponent = null;
  let playerName = $options.playerName;

  function input() {
    $timestamp = Date.now();
    $options.playerName = playerName;
  }

  function submit() {
    if (playerName === "") return playerNameComponent.blink();
    $overlay = null;
  }
</script>

{#if !dialogOpened}
  <form
    class="wellcome content"
    in:blur
    on:input={input}
    on:submit|preventDefault={submit}
  >
    <div class="section-1">
      <span class="big">digifall</span>
    </div>
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <PlayerName bind:this={playerNameComponent} bind:playerName />
        <button type="submit">start</button>
      </div>
    </div>
    <div class="section-4" />
  </form>
{/if}

<Dialog
  title="disclaimer"
  bind:this={dialogComponent}
  bind:opened={dialogOpened}
>
  <div class="col">
    <p>this game doesn't contain tutorial mode!</p>
    <p>the rules may not be obvious at first, but they're pretty simple!</p>
    <button on:click={dialogComponent.close}>continue</button>
  </div>
</Dialog>
