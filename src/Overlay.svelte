<script>

</script>

<style>
  .overlay {
    background-color: var(--color-black-08);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
  }
</style>

<div class="overlay">
  <slot />
</div>
