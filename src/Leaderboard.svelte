<script>
  import { tick } from "svelte";
  import { blur, fly } from "svelte/transition";

  import { KEYS, MAX_RECORDS, OVERLAYS } from "./constants.js";
  import { compare, leaderboardStores } from "./leaderboard.js";
  import { options, overlay } from "./stores.js";
  import VirtualScroll from "./VirtualScroll.svelte";

  const PAGE_SIZE = 100;
  const PAGE_COUNTS = Math.ceil(MAX_RECORDS / PAGE_SIZE) + 1;

  let page = 0;
  let type = KEYS.highScore;
  let startIndex;
  let endIndex;
  let virtualScrollComponent = null;

  function switchType(event) {
    type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
  }

  export function prevPage(value) {
    if (value) {
      page = page < 1 ? PAGE_COUNTS - 1 : page - 1;
      virtualScrollComponent.scrollToIndex(Math.max(page * PAGE_SIZE - 1, 0));
      return page;
    }
    scrollToIndexThrottled(Math.max(startIndex - 8, 0), true);
  }

  export function nextPage(value) {
    if (value) {
      page = page < PAGE_COUNTS - 1 ? page + 1 : 0;
      virtualScrollComponent.scrollToIndex(Math.max(page * PAGE_SIZE - 1, 0));
      return page;
    }
    scrollToIndexThrottled(Math.min(startIndex + 8, MAX_RECORDS - 1), true);
  }

  function selectPage(event) {
    const item = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (item === undefined) return;
    page = Number(item.dataset.index);
    const index =
      page === 0
        ? 0
        : page === 10
          ? MAX_RECORDS - 1
          : item.dataset.index * 100 - 1;
    virtualScrollComponent.scrollToIndex(index);
  }

  function showMenu() {
    $overlay = OVERLAYS.menu;
  }

  function updatePage(endIndex) {
    if (endIndex >= MAX_RECORDS - 2) return (page = 10);
    return (page = getPlaceColor(endIndex));
  }

  function getPlaceColor(place) {
    if (place > 0 && place < MAX_RECORDS * 0.1) return 0;
    if (place >= 100 && place < MAX_RECORDS * 0.2) return 1;
    if (place >= 200 && place < MAX_RECORDS * 0.3) return 2;
    if (place >= 300 && place < MAX_RECORDS * 0.4) return 3;
    if (place >= 400 && place < MAX_RECORDS * 0.5) return 4;
    if (place >= 500 && place < MAX_RECORDS * 0.6) return 5;
    if (place >= 600 && place < MAX_RECORDS * 0.7) return 6;
    if (place >= 700 && place < MAX_RECORDS * 0.8) return 7;
    if (place >= 800 && place < MAX_RECORDS * 0.9) return 8;
    if (place >= 900 && place < MAX_RECORDS) return 9;
    return 0;
  }

  function formatPlace(place) {
    if (place === 0 && selfIndex === -1) return "???";
    return (
      Array.from({ length: 3 - place.toString().length })
        .map(() => "0")
        .join("") + place
    );
  }

  function formatPlayerName(playerName, place) {
    if (place === 0 && selfIndex === -1) return $options[KEYS.playerName];
    return playerName;
  }

  async function scrollToSelf(sorted) {
    await tick();
    virtualScrollComponent.scrollToIndex(
      selfIndex === -1 ? MAX_RECORDS - 1 : Math.max(selfIndex - 7, 0),
    );
  }

  function throttle(cb, delay) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last < delay) return;
      last = now;
      return cb(...args);
    };
  }

  $: leaderboardStore = leaderboardStores[type];
  $: sorted = $leaderboardStore
    .slice()
    .sort((a, b) => compare(b, a))
    .slice(0, MAX_RECORDS);
  $: mapped = [
    ...sorted.map((item, index) => ({
      place: index === 999 ? 0 : index + 1,
      ...item,
    })),
    ...Array.from({ length: MAX_RECORDS - sorted.length }).map(
      (_, index, array) => ({
        place: index === array.length - 1 ? 0 : index + sorted.length + 1,
        playerName: "",
        value: 0,
      }),
    ),
  ];
  $: selfIndex = sorted.findIndex(
    ({ playerName }) => playerName === $options[KEYS.playerName],
  );
  $: updatePage(endIndex);
  $: scrollToSelf(sorted);
  $: scrollToIndexThrottled = virtualScrollComponent
    ? throttle(virtualScrollComponent.scrollToIndex, 250)
    : () => {};
</script>

<div class="leaderboard content" in:blur>
  <div class="section-1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="types"
      title="[switch leaderboard]"
      tabindex="0"
      role="button"
      in:fly|global={{ y: -48 }}
      on:click={switchType}
    >
      <span class="type" class:active={type === KEYS.highCombo}>combos</span>
      <span class="high">high</span>
      <span class="type" class:active={type === KEYS.highScore}>scores</span>
    </div>
  </div>
  <div class="section-2">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <ul
      class="pages"
      title="[select page]"
      tabindex="0"
      role="button"
      on:click={selectPage}
    >
      {#each Array.from({ length: PAGE_COUNTS }) as _, index}
        {@const value = index > 9 ? 0 : index}
        <li
          class="page"
          class:active={index === page}
          style:--color="var(--color-{value})"
          data-index={index}
        >
          {value}
        </li>
      {/each}
    </ul>
  </div>
  <div class="section-3 board" tabindex="-1">
    <VirtualScroll
      items={mapped}
      bind:startIndex
      bind:endIndex
      bind:this={virtualScrollComponent}
      let:item
    >
      {@const { place, playerName, value } = item}
      {@const self = playerName === $options[KEYS.playerName]}
      {@const title =
        "place: " +
        place +
        "\nname: " +
        playerName.toUpperCase() +
        "\nscore: " +
        value}
      <div
        class={[
          "grid",
          {
            first: place === 1,
            second: place === 2,
            third: place === 3,
          },
        ]}
        {title}
      >
        <div class="place" style:color="var(--color-{getPlaceColor(place)})">
          {formatPlace(place)}
        </div>
        <div class="player-name" class:self>
          {formatPlayerName(playerName, place)}
        </div>
        <div class="bar" class:self></div>
        <div class="record" class:self>{value}</div>
      </div>
    </VirtualScroll>
  </div>
  <div class="section-4">
    <div class="col">
      <button title="[open menu]" on:click={showMenu} in:fly={{ y: 48 }}>
        menu
      </button>
    </div>
  </div>
</div>

<style>
  :global .leaderboard .virtual-list {
    margin: 4rem 0 12rem;
  }

  .types {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
    text-shadow: var(--gloss);
  }

  .types:active .high,
  .types:active .active {
    color: var(--color-invis-1);
    border-color: var(--color-invis-1);
    text-shadow: 0 0 1px white;
  }

  .types:active .high {
    box-shadow:
      0 0 1px white,
      inset 0 0 1px white;
  }

  .types:active .type:not(.active) {
    color: var(--color-invis-1);
    border-color: var(--color-invis-1);
    text-shadow: 0 0 1px var(--color-dark);
  }

  .high {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    width: 82rem;
    height: fit-content;
    left: 23rem;
    padding: 2rem 0;
    color: white;
    border: 1rem solid white;
    text-align: left;
  }

  .type {
    position: relative;
    right: 24rem;
    color: white;
    transition: top 200ms ease-in-out;
  }

  .type.active:first-child {
    top: 2.5rem;
  }

  .type:not(.active):first-child {
    top: -7rem;
    color: var(--color-dark);
  }

  .type.active:last-child {
    top: -2.5rem;
  }

  .type:not(.active):last-child {
    top: 8rem;
    color: var(--color-dark);
  }

  .pages {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    font-size: 4rem;
  }

  .page {
    display: flex;
    width: 12rem;
    height: 12rem;
    align-items: center;
    justify-content: center;
    border: 1rem solid transparent;
    color: var(--color);
    cursor: pointer;
    font-weight: bold;
    text-shadow: var(--gloss);
  }

  .page.active {
    border-color: var(--color);
    box-shadow: var(--gloss), var(--shadow-1), var(--shadow-inset);
  }

  .page.active:active {
    border-color: var(--color-invis-2);
    box-shadow:
      0 0 1px var(--color),
      inset 0 0 1px var(--color);
  }

  .page:active {
    color: var(--color-invis-2);
    text-shadow: 0 0 1px var(--color);
  }

  .board {
    padding-left: 1rem;
    margin: 0;
    box-shadow: none;
    font-size: 4rem;
    list-style: none;
    letter-spacing: 0.5rem;
    background-color: transparent;
  }

  .grid {
    display: grid;
    grid-template-columns: 18rem 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "a b b"
      "a c d";
    height: 14rem;
    padding: 2rem 0;
  }

  .grid.first {
    zoom: 1.18;
  }

  .grid.second {
    zoom: 1.12;
  }

  .grid.third {
    zoom: 1.06;
  }

  .place {
    grid-area: a;
    display: grid;
    align-items: center;
    padding-top: 2rem;
    color: var(--color-0);
    text-shadow: var(--gloss);
  }

  .player-name {
    grid-area: b;
    overflow: hidden;
    height: 1em;
    margin-bottom: 1rem;
    justify-content: flex-start;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar {
    grid-area: c;
    height: 4rem;
    flex-grow: 1;
    border-top: 0.75rem solid white;
    border-right: 0.75rem solid white;
    margin-right: 2rem;
  }

  .bar.self {
    border-color: var(--color-random);
  }

  .record {
    grid-area: d;
    height: 4rem;
    justify-content: flex-end;
    margin-right: 1rem;
    text-align: right;
    text-indent: 0;
  }

  .self {
    color: var(--color-random);
  }

  .record.self::before {
    border-color: currentcolor;
    color: inherit;
  }
</style>
