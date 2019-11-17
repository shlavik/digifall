<script>
  import { phase, field, energy } from "./stores.js";
  import Game from "./Game.svelte";

  const style = `
    background-image:
      linear-gradient(90deg, rgba(255,255,255,.07) 50%, transparent 50%),
      linear-gradient(90deg, rgba(255,255,255,.13) 50%, transparent 50%),
      linear-gradient(90deg, transparent 50%, rgba(255,255,255,.17) 50%),
      linear-gradient(90deg, transparent 50%, rgba(255,255,255,.19) 50%);
    background-size:
      calc(7 * var(--pixel)),
      calc(13 * var(--pixel)),
      calc(23 * var(--pixel)),
      calc(31 * var(--pixel));
  `;
</script>

<svelte:window
  on:keypress={({ key }) => {
    console.log('keypress:', key);
    if (key === ' ') phase.set('init');
    if (key === 'f') phase.set('fall');
    if (key === 'z') console.log('field', $field);
    if (key === '1') energy.set(10);
    if (key === '0') energy.set(100);
  }} />

<div class="app">
  <span style="position: absolute">Phase: {$phase}</span>
  <Game />
</div>
