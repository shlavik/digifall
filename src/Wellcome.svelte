<script>
  import { blur } from "svelte/transition";

  import PlayerName from "./PlayerName.svelte";

  import { options, overlay, timestamp } from "./stores.js";

  let playerName;
  let playerNameComponent;

  function input() {
    $timestamp = Date.now();
    $options.playerName = playerName;
  }

  function submit() {
    if (playerName === "") return playerNameComponent.blink();
    $overlay = null;
  }
</script>

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
      <PlayerName bind:playerName bind:this={playerNameComponent} />
      <button type="submit">start</button>
    </div>
  </div>
  <div class="section-4" />
</form>
