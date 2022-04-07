<script>
  import { blur } from "svelte/transition";

  import PlayerName from "./PlayerName.svelte";

  import { KEYS, OVERLAYS } from "./constants.js";
  import { options, overlay, resetGame } from "./stores.js";

  let playerName;

  function checkbox(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const { parentNode, htmlFor } = event.target;
    parentNode.querySelector("#" + htmlFor).click();
  }

  function submit() {
    $overlay = playerName === "" ? OVERLAYS.wellcome : OVERLAYS.menu;
    if (playerName === $options.playerName) return;
    $options.playerName = playerName;
    resetGame();
  }
</script>

<form class="options content" in:blur on:submit|preventDefault={submit}>
  <div class="section-1">
    <span>options</span>
  </div>
  <div class="section-2" />
  <div class="section-3">
    <div class="col">
      <PlayerName bind:playerName />
      <input
        type="checkbox"
        id="leaderboard"
        bind:checked={$options.leaderboard}
      />
      <label for="leaderboard" tabindex="0" on:keydown={checkbox}>
        p2p leaderboard
      </label>
      <input type="checkbox" id="speedrun" bind:checked={$options.speedrun} />
      <label for="speedrun" tabindex="0" on:keydown={checkbox}>
        speedrun mode
      </label>
      <input
        type="checkbox"
        id="sound"
        disabled={$options.speedrun}
        checked={!$options.speedrun && $options.sound}
        on:click={() => ($options.sound = !$options.sound)}
      />
      <label for="sound" tabindex="0" on:keydown={checkbox}>
        sound effects
      </label>
    </div>
  </div>
  <div class="section-4">
    <div class="col">
      <button type="submit" title="RETURN TO MAIN MENU">return</button>
    </div>
  </div>
</form>
