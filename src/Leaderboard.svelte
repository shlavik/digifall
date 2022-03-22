<script>
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";

  import { COLORS, KEYS } from "./constants.js";
  import { compare, leaderboard, maxSize } from "./leaderboard.js";
  import { options, randomColor } from "./stores.js";

  const types = {
    [KEYS.highCombo]: "high combos",
    [KEYS.highScore]: "high scores",
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

  function findStartPage() {
    selfIndex = sorted.findIndex(
      ({ playerName }) => playerName === $options[KEYS.playerName]
    );
    if (selfIndex === -1) return (selfPage = -1);
    selfPage = Math.trunc(selfIndex / pageSize);
    pagePrev = page;
    page = selfPage;
    updateRandomColor();
  }

  function nextType(event) {
    if (event.type === "click" || event.key === "Enter" || event.key === " ") {
      type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
    }
  }

  function selectPage(event) {
    if (event.type === "click" || event.key === "Enter" || event.key === " ") {
      const item = event
        .composedPath()
        .find(({ dataset }) => dataset && dataset.index);
      if (item === undefined) return;
      pagePrev = page;
      page = Number(item.dataset.index);
    }
  }

  function getFlyX(sign = 1) {
    if (page === pagePrev) return 0;
    const amount = 256;
    return sign * (page > pagePrev ? amount : -amount);
  }

  $: updateRandomColor(page);
  $: sorted = $leaderboard[type].slice().sort((a, b) => compare(b, a));
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

<div class="leaderboard">
  <div class="section-1">
    <span
      class="type"
      title="CHANGE LEADERBOARD TYPE"
      tabindex="0"
      on:click={nextType}
      on:keydown={nextType}
    >
      {types[type]}
    </span>
  </div>
  <div class="section-2">
    <ul
      class="pages"
      title="SELECT PAGE"
      on:click={selectPage}
      on:keydown={selectPage}
    >
      {#each Array.from({ length: pageCounts }) as _, index}
        {@const value = index + 1}
        <li
          class="page color-{value}"
          class:active={index === page}
          data-index={index}
          tabindex="0"
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
      <slot />
    </div>
  </div>
</div>
