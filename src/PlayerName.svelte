<script>
  import { options } from "./stores.js";

  let inputElement;

  export let playerName = $options.playerName;

  export function blink(duration = 400) {
    if (!inputElement) return;
    inputElement.classList.toggle("blink");
    setTimeout(() => inputElement.classList.toggle("blink"), duration);
  }

  $: playerName = playerName
    .toLowerCase()
    .replace(/[^a-z0-9\@\&\$\!\?\-\+\=\.\:\/\_]/g, "");
  $: playerNameTitle = ('PLAYER NAME: "' + playerName + '"').toUpperCase();
</script>

<input
  class="player-name"
  type="text"
  name="playerName"
  placeholder="player name"
  title={playerNameTitle}
  maxlength="42"
  bind:value={playerName}
  bind:this={inputElement}
/>
