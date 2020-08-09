<script>
  import { blur } from "svelte/transition";
</script>

<div class="overlay" transition:blur>
  <slot />
</div>
