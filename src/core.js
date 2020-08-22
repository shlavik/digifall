import {
  cards,
  energy,
  log,
  matchedIndexes,
  options,
  overlay,
  phase,
  plusIndex,
  randomColor,
  score,
  seed,
} from "./stores.js";

let $cards,
  $energy,
  $log,
  $matchedIndexes,
  $options,
  $phase,
  $plusIndex,
  $randomColor,
  $score,
  $seed;

function getRandom(prev = 0) {
  return (prev * 16807 + 19487171) % 2147483647;
}

function getInitialRandoms(seed) {
  let count = 1,
    result = [getRandom(seed)];
  while (count < 6) result = result.concat(getRandom(++count * result[0]));
  return result;
}

function getNumberFromString(seed) {
  seed = String(seed).match(/[0-9A-Za-z]/g);
  if (!seed) return 0;
  seed = seed.length > 192 ? seed.slice(0, 192) : seed;
  return Number(parseInt(seed.join(""), 36));
}

function createGetNewCardValue(seed) {
  let randoms = getInitialRandoms(seed);
  return (column) => {
    if (column < 0 || 5 < column) return;
    let result = randoms[column];
    randoms[column] = getRandom(result);
    return Number(result % 10);
  };
}

const getNewCardValue = createGetNewCardValue(getNumberFromString(Date.now()));

function getFieldUndefined() {
  const arr0 = Array(12).fill();
  const arr1 = Array(12).fill();
  const arr2 = Array(12).fill();
  const arr3 = Array(12).fill();
  const arr4 = Array(12).fill();
  const arr5 = Array(12).fill();
  return [arr0, arr1, arr2, arr3, arr4, arr5];
}

function getFieldIndexes(cards) {
  const field = getFieldUndefined();
  cards.forEach((card, index) => (field[card.x][card.y] = index));
  return field;
}

function getCardsFallen(cards) {
  const result = [];
  const field = getFieldIndexes(cards);
  for (let x in field) {
    let count = 0;
    for (let y in field[x]) {
      const index = field[x][y];
      if (index !== undefined) {
        const card = cards[index];
        result[index] = {
          x: card.x,
          y: y - count,
          value: card.value,
          duration: 100 * Math.sqrt(2 * count),
        };
      } else ++count;
    }
  }
  return result;
}

function getMatchedIndexes(cards) {
  const field = getFieldIndexes(cards);
  let groupedArray = [];
  let count = 0;
  const group = (index) => {
    const { value, x, y } = cards[index];
    if (groupedArray[index]) return;
    groupedArray[index] = { value, group: count };
    let topIndex, rightIndex, bottomIndex, leftIndex;
    if (y < 5) topIndex = field[x][y + 1];
    if (x < 5) rightIndex = field[x + 1][y];
    if (y > 0) bottomIndex = field[x][y - 1];
    if (x > 0) leftIndex = field[x - 1][y];
    const isSameValue = (index) => index && cards[index].value === value;
    if (isSameValue(topIndex)) group(topIndex);
    if (isSameValue(rightIndex)) group(rightIndex);
    if (isSameValue(bottomIndex)) group(bottomIndex);
    if (isSameValue(leftIndex)) group(leftIndex);
  };
  for (let index in cards) {
    ++count;
    group(index);
  }
  const groupedObject = groupedArray.reduce(
    (result, { value, group }, index) => ({
      ...result,
      [group]: {
        value,
        indexes: [...(result[group] ? result[group].indexes : []), index],
      },
    }),
    {}
  );
  return Object.keys(groupedObject).reduce((result, group) => {
    const { value, indexes } = groupedObject[group];
    return value === indexes.length ? [...result, ...indexes] : result;
  }, []);
}

function getCardsMatched(cards, matchedIndexes) {
  const counts = [0, 0, 0, 0, 0, 0];
  const getNewY = (x) =>
    counts[x] +
    cards
      .filter((card) => card.x === x)
      .sort(({ y: y1 }, { y: y2 }) => y1 - y2)[5].y;
  return cards.map((card, index) => {
    if (matchedIndexes.includes(index) && card.y < 6) {
      ++counts[card.x];
      return {
        x: card.x,
        y: getNewY(card.x),
        value: getNewCardValue(card.x),
        duration: 0,
      };
    } else return card;
  });
}

/******************************************************************************/

function getDiffFromBuffer(buffer) {
  const { abs, sign, sqrt, trunc } = Math;
  return sign(buffer) * trunc(sqrt(abs(buffer)));
}

/* ENERGY LOGIC ***************************************************************/

function updateRandomColor() {
  if ($energy.value > 100 || $phase !== "score") {
    randomColor.set(`hsl(${Math.floor(360 * Math.random())}, 100%, 50%)`);
    requestAnimationFrame(updateRandomColor);
  } else {
    randomColor.set("white");
  }
}

function doEnergyLogic() {
  if ($randomColor === "white") updateRandomColor();
  const { buffer, value } = $energy;
  const diff = getDiffFromBuffer(buffer);
  if ($phase === "extra") {
    if (buffer === 0)
      return setTimeout(() => phase.set("total"), $options.delay || 800);
    const [{ extra }] = $log.slice(-1);
    log.set($log.slice(0, -1).concat({ extra: extra - diff }));
  }
  if (buffer === 0) return;
  setTimeout(() => {
    energy.set({
      buffer: buffer - diff,
      value: value + diff,
    });
  }, $options.delay || 20);
}

/* PHASE LOGIC ****************************************************************/

function doIdlePhase() {}

function doPlusPhase() {
  cards.set(
    $cards.map((card, cardIndex) =>
      $plusIndex === cardIndex && card.y < 6
        ? {
            x: card.x,
            y: card.y,
            value: card.value < 9 ? card.value + 1 : 0,
            duration: 0,
          }
        : card
    )
  );
  phase.set("blink");
}

function doBlinkPhase() {
  $matchedIndexes = getMatchedIndexes($cards);
  if ($matchedIndexes.length > 0) {
    log.set(
      $log.concat(
        $matchedIndexes.reduce((result, index) => {
          const { value } = $cards[index];
          result[value] = (result[value] || 0) + value;
          result.sum = (result.sum || 0) + value;
          return result;
        }, {})
      )
    );
    const buffer = $matchedIndexes.reduce(
      (result, index) => result + $cards[index].value,
      0
    );
    setTimeout(() => energy.set({ ...$energy, buffer }), $options.delay || 400);
    setTimeout(() => phase.set("match"), $options.delay || 800);
  } else if ($energy.value > 100) {
    phase.set("extra");
  } else if ($energy.value < 10) {
    phase.set("gameover");
  } else if ($log.length > 0) {
    phase.set("total");
  } else {
    phase.set("idle");
  }
  plusIndex.set(undefined);
  matchedIndexes.set($matchedIndexes);
}

function doMatchPhase() {
  cards.set(getCardsMatched($cards, $matchedIndexes));
  matchedIndexes.set([]);
  setTimeout(() => phase.set("fall"), $options.delay || 400);
}

function doFallPhase() {
  cards.set(getCardsFallen($cards));
  setTimeout(() => phase.set("blink"), $options.delay || 400);
}

function doExtraPhase() {
  log.set($log.concat({ extra: 0 }));
  energy.set({ ...$energy, buffer: 100 - $energy.value });
}

function doTotalPhase() {
  score.set({
    ...$score,
    buffer: $log.reduce(
      (result, { extra, sum }, index) => result + (index + 1) * (sum || extra),
      0
    ),
  });
  setTimeout(
    () => phase.set("score"),
    $options.delay || $log.length > 1 ? 800 : 0
  );
}

function doScorePhase() {
  score.set({ ...$score });
}

function doGameoverPhase() {
  overlay.set(true);
}

function doPhaseLogic() {
  Object({
    idle: doIdlePhase,
    plus: doPlusPhase,
    blink: doBlinkPhase,
    match: doMatchPhase,
    fall: doFallPhase,
    extra: doExtraPhase,
    total: doTotalPhase,
    score: doScorePhase,
    gameover: doGameoverPhase,
  })[$phase]();
}

/* SCORE LOGIC ****************************************************************/

export function getTimeFromDiff(diff) {
  switch (Math.abs(diff)) {
    case 1:
      return 130;
    case 2:
    case 3:
      return 80;
    case 4:
    case 5:
    case 6:
      return 50;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return 30;
    default:
      return 20;
  }
}

function doScoreLogic() {
  if ($phase !== "score") return;
  const { buffer, value } = $score;
  if (buffer === 0)
    return setTimeout(() => {
      log.set([]);
      phase.set("idle");
    }, $options.delay || 200);
  const diff = getDiffFromBuffer(buffer);
  const ms = $options.delay || getTimeFromDiff(diff);
  setTimeout(() => {
    score.set({
      buffer: buffer - diff,
      value: value + diff,
    });
  }, ms);
}

/* SEED LOGIC *****************************************************************/

function getFieldRandom() {
  return Array(36)
    .fill(undefined)
    .map((_, index) => ({
      x: Math.floor(index / 6),
      y: index % 6,
      value: getNewCardValue(Math.floor(index / 6)),
      duration: 0,
    }));
}

function getFieldPrepared(field) {
  let matchedIndexes = 1;
  while (matchedIndexes) {
    matchedIndexes = getMatchedIndexes(field);
    if (matchedIndexes.length === 0) return field;
    field = getCardsFallen(getCardsMatched(field, matchedIndexes));
  }
}

export function getFieldInitial() {
  return getFieldPrepared(getFieldRandom());
}

function doSeedLogic() {
  cards.set(getFieldInitial());
}

/* CORE INITIALIZATION ****************************************************/

export function initCore() {
  cards.subscribe((value) => ($cards = value));
  energy.subscribe((value) => {
    $energy = value;
    doEnergyLogic();
  });
  log.subscribe((value) => ($log = value));
  matchedIndexes.subscribe((value) => ($matchedIndexes = value));
  options.subscribe((value) => ($options = value));
  phase.subscribe((value) => {
    $phase = value;
    doPhaseLogic();
  });
  plusIndex.subscribe((value) => ($plusIndex = value));
  randomColor.subscribe((value) => ($randomColor = value));
  score.subscribe((value) => {
    $score = value;
    doScoreLogic();
  });
  seed.subscribe((value) => {
    $seed = value;
    doSeedLogic();
  });
}
