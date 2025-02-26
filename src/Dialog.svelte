<script>
  import { createEventDispatcher } from "svelte";
  import { blur, fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let title = "";
  export let opened = false;

  export function isOpened() {
    return opened;
  }

  export function close() {
    opened = false;
    dispatch("close");
  }

  export function show() {
    opened = true;
    dispatch("show");
  }
</script>

{#if opened}
  <div class="dialog content" in:blur>
    <div class="section-1">
      {#if title}
        <span class="title" in:fly={{ y: -48 }}>
          {title}
        </span>
      {/if}
    </div>
    <div class="section-2"></div>
    <div class="section-3" in:fly={{ y: 24 }}>
      <slot />
    </div>
    <div class="section-4"></div>
  </div>
{/if}
