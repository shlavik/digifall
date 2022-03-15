<script>
  import { KEYS } from "./constants.js";
  import { compare, leaderboard, maxSize } from "./leaderboard.js";

  const types = {
    [KEYS.highCombo]: "high combo",
    [KEYS.highScore]: "high score",
  };

  let type = KEYS.highScore;
  let page = 0;
  const pageSize = 9;

  function nextType() {
    type = type === KEYS.highScore ? KEYS.highCombo : KEYS.highScore;
  }

  function pageClick(event) {
    const item = event
      .composedPath()
      .find(({ dataset }) => dataset && dataset.index);
    if (item === undefined) return;
    page = Number(item.dataset.index);
  }

  $: sorted = $leaderboard[type].slice().sort((a, b) => compare(b, a));
  $: start = page * pageSize;
  $: end = start + pageSize;
  $: paged = sorted.slice(start, end);
  $: list = paged.concat(
    Array.from({ length: pageSize - paged.length }).fill({
      playerName: "",
      value: 0,
    })
  );
</script>

<div class="leaderboard">
  <div class="section-1">
    <div class="type" title="CHANGE LEADERBOARD TYPE" on:click={nextType}>
      <span>{types[type]}</span>
    </div>
  </div>
  <div class="section-2">
    <div class="pages" title="SELECT PAGE" on:click={pageClick}>
      {#each Array.from({ length: maxSize / pageSize }) as _, index}
        {@const value = index + 1}
        <div
          class="page color-{value}"
          class:active={index === page}
          data-index={index}
        >
          {value}
        </div>
      {/each}
    </div>
  </div>
  <div class="section-3">
    <dl>
      {#each list as { playerName, value }, index}
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
        <dt style:margin-left={marginLeft} data-nth={nth}>
          <div class="player-name" {title}>{playerName}</div>
        </dt>
        <dd style:margin-left={marginLeft} {title}>{value}</dd>
      {/each}
    </dl>
  </div>
  <div class="section-4">
    <div class="col">
      <slot />
    </div>
  </div>
</div>
