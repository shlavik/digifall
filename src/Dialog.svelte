<script>
  import { createEventDispatcher } from "svelte";
  import { blur } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let text = "";
  export let opened = false;

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
  <div class="screen blur" />
  <div class="dialog content" in:blur>
    <div class="section-1" />
    <div class="section-2" />
    <div class="section-3">
      <div class="col">
        <span>{text}</span>
        <slot name="content" />
        <div class="row">
          <slot />
        </div>
      </div>
    </div>
    <div class="section-4" />
  </div>
{/if}
