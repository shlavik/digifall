<script>
  import { options } from "./stores.js";
  import { sanitizePlayerName } from "./validation.js";

  export let playerName = $options.playerName;

  let inputElement = null;
  let visibility = "hidden";

  export function blink(duration = 400) {
    visibility = "hidden";
    if (!inputElement) return;
    inputElement.classList.toggle("blink");
    setTimeout(() => inputElement.classList.toggle("blink"), duration);
  }

  $: {
    let playerNamePrev = playerName;
    playerName = sanitizePlayerName(playerName);
    visibility = playerNamePrev !== playerName ? "visible" : "hidden";
    if (playerName === "") inputElement && inputElement.focus();
  }
  $: title = "player name: " + playerName.toUpperCase();
</script>

<span class="symbols" style:visibility>a-z 0-9 @&$!?-+=.:/_</span>
<input
  class="player-name"
  type="text"
  inputmode="url"
  placeholder="player name"
  spellcheck="false"
  maxlength="42"
  {title}
  bind:this={inputElement}
  bind:value={playerName}
/>
