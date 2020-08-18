<script>
  import { blur } from "svelte/transition";
  import { options } from "./stores";
</script>

<div class="overlay" transition:blur={{ duration: $options.delay || 400 }}>
  <slot />
</div>
