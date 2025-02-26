<script>
  export let items;
  export let startIndex;
  export let endIndex;

  let scrollTop = 0;
  let containerHeight = 0;
  let itemHeight = 1;
  let scrollContainer;

  const bufferSize = 18;

  function scrollHandler(event) {
    scrollTop = event.target.scrollTop;
  }

  export function scrollToIndex(index, second = true, smooth = false) {
    if (index < 0 || index >= items.length) return;
    if (!scrollContainer) return;
    scrollContainer.scrollTo({
      top: index * itemHeight,
      behavior: smooth ? "smooth" : "instant",
    });
    if (!second || smooth) return;
    setTimeout(() => {
      scrollContainer.scrollTo({
        top: index * itemHeight,
        behavior: "instant",
      });
    }, 60);
  }

  $: startIndex = Math.floor(scrollTop / itemHeight);
  $: endIndex = startIndex + Math.ceil(containerHeight / itemHeight);
  $: fromIndex = Math.max(0, startIndex - bufferSize);
  $: toIndex = Math.min(endIndex + bufferSize, items.length);
  $: visibleItems = items.slice(fromIndex, toIndex);
  $: contentTopOffset = fromIndex * itemHeight;
  $: totalHeight = items.length * itemHeight;
</script>

<div
  class="virtual-scroll"
  bind:this={scrollContainer}
  bind:clientHeight={containerHeight}
  on:scroll={scrollHandler}
>
  <div
    class="virtual-list"
    style:height="{totalHeight}px"
    style:padding-top="{contentTopOffset}px"
  >
    {#each visibleItems as item}
      <div class="virtual-item" bind:clientHeight={itemHeight}>
        <slot {item} />
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

  .virtual-item {
    width: 100%;
  }
</style>
