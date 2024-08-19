<script>
  import { blur, fly } from "svelte/transition";

  import { MAX_RECORDS, KEYS, OVERLAYS } from "./constants.js";
  import { compare, leaderboardStores } from "./leaderboard.js";
  import { options, overlay } from "./stores.js";

  const pageSize = 9;
  let page = 0;

  const pageCounts = Math.ceil(MAX_RECORDS / pageSize);
  let type = KEYS.highScore;
  let pagePrev = page;

  const types = {
    [KEYS.highCombo]: "combos",
    [KEYS.highScore]: "scores",
  };

  export function prevPage() {
    pagePrev = page;
    return (page = page < 1 ? pageSize - 1 : page - 1);
  }

  export function nextPage() {
    pagePrev = page;
    return (page = page < pageSize - 1 ? page + 1 : 0);
  }

  function findStartPage(sorted) {
    const selfIndex = sorted.findIndex(
      ({ playerName }) => playerName === $options[KEYS.playerName],
    );
    if (selfIndex === -1) return;
    pagePrev = page;
    page = Math.trunc(selfIndex / pageSize);
  }

  function switchType(event) {
    type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
  }

  function selectPage(event) {
    const item = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (item === undefined) return;
    pagePrev = page;
    page = Number(item.dataset.index);
  }

  function getFlyX(ratio = 1) {
    if (page === pagePrev) return 0;
    const amount = 256;
    return ratio * (page > pagePrev ? amount : -amount);
  }

  function showMenu() {
    $overlay = OVERLAYS.menu;
  }

  $: leaderboardStore = leaderboardStores[type];
  $: sorted = $leaderboardStore.slice().sort((a, b) => compare(b, a));
  $: findStartPage(sorted);
  $: start = page * pageSize;
  $: end = start + pageSize;
  $: paged = sorted.slice(start, end);
  $: paged.push(
    ...Array.from({ length: pageSize - paged.length }).fill({
      playerName: "",
      value: 0,
    }),
  );
</script>

<div class="leaderboard content" in:blur>
  <div class="section-1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="type"
      title="[switch leaderboard]"
      tabindex="0"
      role="button"
      in:fly={{ y: -48 }}
      on:click={switchType}
    >
      <span>
        <span>high</span>
        {#key types[type]}
          <span in:blur={{ duration: 200 }}>{types[type]}</span>
        {/key}
      </span>
    </div>
  </div>
  <div class="section-2">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <ul
      class="pages"
      title="select page"
      tabindex="0"
      role="button"
      on:click={selectPage}
    >
      {#each Array.from({ length: pageCounts }) as _, index}
        {@const value = index + 1}
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
  <div class="section-3">
    {#key page}
      <dl in:fly|global={{ x: getFlyX(1) }} out:fly={{ x: getFlyX(-1) }}>
        {#each paged as { playerName, value }, index}
          {@const self = playerName === $options[KEYS.playerName]}
          {@const nth = page * pageSize + index + 1}
          {@const marginLeft = (nth.toString().length === 1 ? 8 : 14) + "rem"}
          {@const delay = index % 10}
          {@const title =
            "place: " +
            nth +
            "\nplayer name: " +
            playerName.toUpperCase() +
            "\nscore: " +
            value}
          <dt class:self style:margin-left={marginLeft} data-nth={nth}>
            <div class="player-name" style:--delay={delay} {title}>
              {playerName}
            </div>
          </dt>
          <dd class:self style:margin-left={marginLeft} {title}>
            {value}
          </dd>
        {/each}
      </dl>
    {/key}
  </div>
  <div class="section-4">
    <div class="col">
      <button title="[open menu]" on:click={showMenu} in:fly={{ y: 48 }}>
        return
      </button>
    </div>
  </div>
</div>
