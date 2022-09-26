<script>
  import { onDestroy } from "svelte";
  import { blur, fly } from "svelte/transition";

  import { longpress } from "./actions.js";
  import { COLORS, KEYS, OVERLAYS } from "./constants.js";
  import { compare, leaderboards, maxSize } from "./leaderboard.js";
  import { options, overlay, randomColor } from "./stores.js";

  const types = {
    [KEYS.highCombo]: "combos",
    [KEYS.highScore]: "scores",
  };
  const pageSize = 9;
  const pageCounts = Math.ceil(maxSize / pageSize);

  let type = KEYS.highScore;
  let page = 0;
  let pagePrev = page;
  let selfPage = -1;

  onDestroy(() => (selfPage = -1));

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
    if (event.type === "longpress") {
      changeType.longpress = true;
      changeType.prevent = false;
    }
    if (changeType.prevent === true) return (changeType.prevent = false);
    if (!checkEvent(event)) return;
    type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
  }

  function onStop() {
    if (changeType.longpress !== true) return (changeType.prevent = false);
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
  $: leaderboard = leaderboards[type];
  $: sorted = $leaderboard.slice().sort((a, b) => compare(b, a));
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
    <div
      class="type"
      title="CHANGE LEADERBOARD TYPE"
      tabindex="0"
      in:fly={{ y: -48 }}
      on:click={changeType}
      on:keydown={changeType}
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
    <ul
      class="pages"
      title="SELECT PAGE"
      on:click={selectPage}
      on:keydown={selectPage}
      on:longpress={selectPage}
    >
      {#each Array.from({ length: pageCounts }) as _, index}
        {@const value = index + 1}
        <li
          class="page"
          class:active={index === page}
          style:--color="var(--color-{value})"
          data-index={index}
          tabindex="0"
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
