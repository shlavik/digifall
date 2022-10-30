<script>
  import { onDestroy } from "svelte";
  import { blur, fly } from "svelte/transition";

  import { longpress } from "./actions.js";
  import { COLORS, KEYS, OVERLAYS } from "./constants.js";
  import { compare, leaderboardStores, maxSize } from "./leaderboard.js";
  import { options, overlay, randomColor } from "./stores.js";

  const pageSize = 9;
  let page = 0;

  const pageCounts = Math.ceil(maxSize / pageSize);
  let type = KEYS.highScore;
  let pagePrev = page;
  let selfPage = -1;

  const types = {
    [KEYS.highCombo]: "combos",
    [KEYS.highScore]: "scores",
  };

  onDestroy(() => (selfPage = -1));

  export function prevPage() {
    pagePrev = page;
    return (page = page < 1 ? pageSize - 1 : page - 1);
  }

  export function nextPage() {
    pagePrev = page;
    return (page = page < pageSize - 1 ? page + 1 : 0);
  }

  function updateRandomColor() {
    if (page !== selfPage) return ($randomColor = COLORS.white);
    const hue = Math.trunc(360 * Math.random());
    $randomColor = `hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(updateRandomColor);
  }

  function findStartPage(sorted) {
    const selfIndex = sorted.findIndex(
      ({ playerName }) => playerName === $options[KEYS.playerName]
    );
    if (selfIndex === -1) return (selfPage = -1);
    selfPage = Math.trunc(selfIndex / pageSize);
    pagePrev = page;
    page = selfPage;
    updateRandomColor();
  }

  function checkEvent(event) {
    return (
      event.type === "click" ||
      event.key === "Enter" ||
      event.key === " " ||
      event.type === "longpress"
    );
  }

  function changeType(event) {
    if (event.type === "keydown") return;
    if (event.type === "longpress") {
      changeType.longpress = true;
      changeType.prevent = false;
    }
    if (changeType.prevent) return (changeType.prevent = false);
    if (!checkEvent(event)) return;
    type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
  }

  function onStop() {
    if (!changeType.longpress) return (changeType.prevent = false);
    changeType.longpress = false;
    changeType.prevent = true;
  }

  function selectPage(event) {
    if (!checkEvent(event)) return;
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

  $: updateRandomColor(page);
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
    })
  );
</script>

<div class="leaderboard content" in:blur>
  <div class="section-1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="type"
      title="CHANGE LEADERBOARD TYPE"
      tabindex="0"
      role="button"
      in:fly={{ y: -48 }}
      on:click={changeType}
      on:longpress={changeType}
      use:longpress={{ onStop }}
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
      title="SELECT PAGE"
      tabindex="0"
      role="button"
      on:click={selectPage}
      on:longpress={selectPage}
    >
      {#each Array.from({ length: pageCounts }) as _, index}
        {@const value = index + 1}
        <li
          class="page"
          class:active={index === page}
          style:--color="var(--color-{value})"
          data-index={index}
          use:longpress
        >
          {value}
        </li>
      {/each}
    </ul>
  </div>
  <div class="section-3">
    {#key page}
      <dl in:fly={{ x: getFlyX(1) }} out:fly|local={{ x: getFlyX(-1) }}>
        {#each paged as { playerName, value }, index}
          {@const self = playerName === $options[KEYS.playerName]}
          {@const nth = page * pageSize + index + 1}
          {@const marginLeft = (nth.toString().length === 1 ? 8 : 14) + "rem"}
          {@const title = (
            "PLACE: " +
            nth +
            '\nPLAYER NAME: "' +
            playerName +
            '"\nSCORE: ' +
            value
          ).toUpperCase()}
          <dt class:self style:margin-left={marginLeft} data-nth={nth}>
            <div class="player-name" {title}>{playerName}</div>
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
      <button
        title="RETURN TO MAIN MENU"
        on:click={showMenu}
        in:fly={{ y: 48 }}
      >
        return
      </button>
    </div>
  </div>
</div>
