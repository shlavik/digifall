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
import { getRandom } from "./utils";

let $cards,
  $energy,
  $log,
  $matchedIndexes,
  $options,
  $phase,
  $plusIndex,
  $randomColor,
  $score,
  $seed,
  getNewCardValue;

const { abs, floor, random, sign, sqrt, trunc } = Math;

function delayTransition(callback, timeout) {
  if ($options.transitions) setTimeout(callback, timeout);
  else callback();
}

/* CARDS LOGIC ****************************************************************/

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
          duration: $options.transitions ? 100 * sqrt(2 * count) : 0,
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

/* ENERGY LOGIC ***************************************************************/

function updateRandomColor() {
  if ($energy.value > 100 || $phase !== "score") {
    randomColor.set(`hsl(${floor(360 * random())}, 100%, 50%)`);
    requestAnimationFrame(updateRandomColor);
  } else {
    randomColor.set("white");
  }
}

function getDiffFromBuffer(buffer) {
  return sign(buffer) * trunc(sqrt(abs(buffer)));
}

function doEnergyLogic() {
  if ($randomColor === "white") updateRandomColor();
  const { buffer, value } = $energy;
  const diff = $phase === "gameover" ? sign(buffer) : getDiffFromBuffer(buffer);
  if ($phase === "extra") {
    if (buffer === 0) return delayTransition(() => phase.set("total"), 800);
    const [{ extra }] = $log.slice(-1);
    log.set($log.slice(0, -1).concat({ extra: extra - diff }));
  }
  if (buffer === 0) return;
  delayTransition(
    () => {
      energy.set({
        buffer: $options.transitions ? buffer - diff : 0,
        value: $options.transitions ? value + diff : value + buffer,
      });
    },
    $phase === "gameover" ? 200 : 20
  );
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
    delayTransition(() => energy.set({ ...$energy, buffer }), 400);
    delayTransition(() => phase.set("match"), 800);
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
  delayTransition(() => phase.set("fall"), 400);
}

function doFallPhase() {
  cards.set(getCardsFallen($cards));
  delayTransition(() => phase.set("blink"), 400);
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
  delayTransition(() => phase.set("score"), $log.length > 1 ? 800 : 0);
}

function doScorePhase() {
  score.set({ ...$score });
}

function doGameoverPhase() {
  overlay.set(true);
  delayTransition(() => {
    if ($phase !== "gameover") return;
    energy.set({
      ...$energy,
      buffer: -$energy.value,
    });
    score.set({
      ...$score,
      buffer: $energy.value,
    });
  }, 400);
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
  switch (abs(diff)) {
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
  if ($phase !== "gameover" && $phase !== "score") return;
  const { buffer, value } = $score;
  if (buffer === 0) {
    if ($phase !== "gameover")
      delayTransition(() => {
        log.set([]);
        phase.set("idle");
      }, 200);
    return;
  }
  const diff = $phase === "gameover" ? sign(buffer) : getDiffFromBuffer(buffer);
  const ms = $phase === "gameover" ? 200 : getTimeFromDiff(diff);
  delayTransition(() => {
    score.set({
      buffer: $options.transitions ? buffer - diff : 0,
      value: $options.transitions ? value + diff : value + buffer,
    });
  }, ms);
}

/* SEED LOGIC *****************************************************************/

function getInitialRandoms(seed) {
  let count = 1,
    result = [getRandom(seed)];
  while (count < 6) result = result.concat(getRandom(++count * result[0]));
  return result;
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

function getFieldRandom() {
  return Array(36)
    .fill(undefined)
    .map((_, index) => ({
      x: floor(index / 6),
      y: index % 6,
      value: getNewCardValue(floor(index / 6)),
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
  getNewCardValue = createGetNewCardValue($seed);
  cards.set(getFieldInitial());
}

/* CORE INITIALIZATION ********************************************************/

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
