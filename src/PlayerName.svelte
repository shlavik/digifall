<script>
  import { options } from "./stores.js";

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
    playerName = playerName
      .toLowerCase()
      .replace(/[^a-z0-9\@\&\$\!\?\-\+\=\.\:\/\_]/g, "");
    visibility = playerNamePrev !== playerName ? "visible" : "hidden";
    if (playerName === "") inputElement && inputElement.focus();
  }
  $: title = ('PLAYER NAME: "' + playerName + '"').toUpperCase();
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
