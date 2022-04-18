<script>
  import { options } from "./stores.js";

  let inputElement;
  let visibility = "hidden";

  export let playerName = $options.playerName;

  export function blink(duration = 400) {
    visibility = "hidden";
    if (!inputElement) return;
    inputElement.classList.toggle("blink");
    setTimeout(() => inputElement.classList.toggle("blink"), duration);
  }

  $: {
    let previousPlayerName = playerName;
    playerName = playerName
      .toLowerCase()
      .replace(/[^a-z0-9\@\&\$\!\?\-\+\=\.\:\/\_]/g, "");
    visibility = previousPlayerName !== playerName ? "visible" : "hidden";
  }
  $: playerNameTitle = ('PLAYER NAME: "' + playerName + '"').toUpperCase();
</script>

<span class="symbols" style:visibility>a-z 0-9 @&$!?-+=.:/_</span>
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
