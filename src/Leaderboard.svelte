<script>
  import { onDestroy } from "svelte";

  import { COLORS, KEYS } from "./constants.js";
  import { compare, leaderboard, maxSize } from "./leaderboard.js";
  import { options, randomColor } from "./stores.js";

  const types = {
    [KEYS.highCombo]: "high combo",
    [KEYS.highScore]: "high score",
  };
  const pageSize = 9;
  const pageCounts = Math.ceil(maxSize / pageSize);

  let type = KEYS.highScore;
  let page = 0;
  let sortedIndex = -1;

  onDestroy(() => (sortedIndex = -1));

  function findStartPage(sorted) {
    sortedIndex = sorted.findIndex(
      ({ playerName }) => playerName === $options[KEYS.playerName]
    );
    page = sortedIndex > -1 ? Math.floor(sortedIndex / 9) : 0;
    updateRandomColor();
  }

  function updateRandomColor() {
    if (sortedIndex === -1) return ($randomColor = COLORS.white);
    const hue = Math.trunc(360 * Math.random());
    $randomColor = `hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(updateRandomColor);
  }

  function nextType(event) {
    if (event.type === "click" || event.key === "Enter" || event.key === " ") {
      type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
    }
  }

  function pageSelect(event) {
    if (event.type === "click" || event.key === "Enter" || event.key === " ") {
      const item = event
        .composedPath()
        .find(({ dataset }) => dataset && dataset.index);
      if (item === undefined) return;
      page = Number(item.dataset.index);
    }
  }

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
      on:click={pageSelect}
      on:keydown={pageSelect}
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
    <dl>
      {#each paged as { playerName, value }, index}
        {@const self = playerName === $options[KEYS.playerName]}
        {@const color = self ? $randomColor : "white"}
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
        <dt style:--color={color} style:margin-left={marginLeft} data-nth={nth}>
          <div class="player-name" {title}>{playerName}</div>
        </dt>
        <dd style:--color={color} style:margin-left={marginLeft} {title}>
          {value}
        </dd>
      {/each}
    </dl>
  </div>
  <div class="section-4">
    <div class="col">
      <slot />
    </div>
  </div>
</div>
