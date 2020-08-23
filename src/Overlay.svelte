<script>
  import { fade } from "svelte/transition";
  import { options } from "./stores";
</script>

<div class="overlay" transition:fade={{ duration: $options.delay || 200 }}>
  <slot />
</div>
