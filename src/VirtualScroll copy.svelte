<script>
  export let items;

  let scrollTop = 0;
  let containerHeight = 0;
  let itemHeight = 1;

  const bufferSize = 32;

  function measureHeight(node, index) {
    if (index > 0) return;
    itemHeight = node.clientHeight;
  }

  function scrollHandler(event) {
    scrollTop = event.target.scrollTop;
  }

  $: startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
  $: endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 2 * bufferSize,
    items.length,
  );
  $: visibleItems = items.slice(startIndex, endIndex);
  $: contentTopOffset = startIndex * itemHeight;
  $: totalHeight = items.length * itemHeight;
</script>

<div
  class="virtual-scroll"
  bind:clientHeight={containerHeight}
  on:scroll={scrollHandler}
>
  <div
    class="virtual-list"
    style:height="{totalHeight}px"
    style:padding-top="{contentTopOffset}px"
  >
    {#each visibleItems as item, index}
      <div class="virtual-item" use:measureHeight={index}>
        <slot {item} {index} />
      </div>
    {/each}
  </div>
</div>

<style>
  .virtual-scroll {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .virtual-list {
  }

  .virtual-item {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
