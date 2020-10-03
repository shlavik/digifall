import { get } from "svelte/store";
import {
  cards,
  energy,
  log,
  matchedIndexes,
  moves,
  options,
  overlay,
  phase,
  plusIndex,
  randomColor,
  score,
  seed,
} from "./stores.js";
import { getArrayFromBase64, getRandom } from "./utils";

const { abs, floor, random, sign, sqrt, trunc } = Math;

let getNewCardValue;
let moveCount = 0;
let movesInitial;

function delayTransition(callback, timeout) {
  if (movesInitial === undefined && get(options).transitions)
    setTimeout(callback, timeout);
  else callback();
}

/* CARDS LOGIC ****************************************************************/

function getCardsPlused($cards, plusIndex) {
  return $cards.map((card, cardIndex) =>
    plusIndex === cardIndex && card.y < 6
      ? {
          x: card.x,
          y: card.y,
          value: card.value < 9 ? card.value + 1 : 0,
          duration: 0,
        }
      : card
  );
}

function getFieldUndefined() {
  const arr0 = Array(12).fill();
  const arr1 = Array(12).fill();
  const arr2 = Array(12).fill();
  const arr3 = Array(12).fill();
  const arr4 = Array(12).fill();
  const arr5 = Array(12).fill();
  return [arr0, arr1, arr2, arr3, arr4, arr5];
}

function getFieldIndexes($cards) {
  const field = getFieldUndefined();
  $cards.forEach((card, index) => (field[card.x][card.y] = index));
  return field;
}

function getCardsFallen($cards) {
  const result = [];
  const field = getFieldIndexes($cards);
  for (let x in field) {
    let count = 0;
    for (let y in field[x]) {
      const index = field[x][y];
      if (index !== undefined) {
        const card = $cards[index];
        result[index] = {
          x: card.x,
          y: y - count,
          value: card.value,
          duration:
            movesInitial === undefined && get(options).transitions
              ? 100 * sqrt(2 * count)
              : 0,
        };
      } else ++count;
    }
  }
  return result;
}

function getMatchedIndexes($cards) {
  const field = getFieldIndexes($cards);
  let groupedArray = [];
  let count = 0;
  const group = (index) => {
    const { value, x, y } = $cards[index];
    if (groupedArray[index]) return;
    groupedArray[index] = { value, group: count };
    let topIndex, rightIndex, bottomIndex, leftIndex;
    if (y < 5) topIndex = field[x][y + 1];
    if (x < 5) rightIndex = field[x + 1][y];
    if (y > 0) bottomIndex = field[x][y - 1];
    if (x > 0) leftIndex = field[x - 1][y];
    const isSameValue = (index) =>
      index !== undefined && $cards[index].value === value;
    if (isSameValue(topIndex)) group(topIndex);
    if (isSameValue(rightIndex)) group(rightIndex);
    if (isSameValue(bottomIndex)) group(bottomIndex);
    if (isSameValue(leftIndex)) group(leftIndex);
  };
  for (let index in $cards) {
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

function getCardsMatched($cards, matchedIndexes) {
  const counts = [0, 0, 0, 0, 0, 0];
  const getNewY = (x) =>
    counts[x] +
    $cards
      .filter((card) => card.x === x)
      .sort(({ y: y1 }, { y: y2 }) => y1 - y2)[5].y;
  return $cards.map((card, index) => {
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
  if (get(energy).value > 100 || get(phase) !== "score") {
    randomColor.set(`hsl(${floor(360 * random())}, 100%, 50%)`);
    requestAnimationFrame(updateRandomColor);
  } else {
    randomColor.set("white");
  }
}

function getDiffFromBuffer(buffer) {
  return sign(buffer) * trunc(sqrt(abs(buffer)));
}

function doEnergyLogic({ buffer, value }) {
  if (get(randomColor) === "white") updateRandomColor();
  const { transitions } = get(options);
  const $phase = get(phase);
  const diff =
    movesInitial === undefined && transitions
      ? $phase === "gameover"
        ? sign(buffer)
        : getDiffFromBuffer(buffer)
      : buffer;
  if ($phase === "extra") {
    if (buffer === 0) return delayTransition(() => phase.set("total"), 800);
    log.update(($log) => {
      const [{ extra }] = $log.slice(-1);
      return $log.slice(0, -1).concat({ extra: extra - diff });
    });
  }
  if (buffer === 0) return;
  delayTransition(
    () => {
      energy.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === "gameover" ? 200 : 20
  );
}

/* PHASE LOGIC ****************************************************************/

function doInitPhase() {
  setTimeout(() => phase.set("idle"));
}

function doIdlePhase() {
  if (movesInitial !== undefined) {
    if (moveCount < movesInitial.length) {
      plusIndex.set(movesInitial[moveCount++]);
      energy.update(({ buffer, value }) => ({ buffer, value: value - 10 }));
      phase.set("plus");
    } else movesInitial = undefined;
  }
}

function doPlusPhase() {
  cards.update(($cards) => getCardsPlused($cards, get(plusIndex)));
  plusIndex.set(undefined);
  phase.set("blink");
}

function doBlinkPhase() {
  const $cards = get(cards);
  let newMatchedIndexes = getMatchedIndexes($cards);
  matchedIndexes.set(newMatchedIndexes);
  if (newMatchedIndexes.length > 0) {
    log.update(($log) =>
      $log.concat(
        newMatchedIndexes.reduce((result, index) => {
          const { value } = $cards[index];
          result[value] = (result[value] || 0) + value;
          result.sum = (result.sum || 0) + value;
          return result;
        }, {})
      )
    );
    const buffer = newMatchedIndexes.reduce(
      (result, index) => result + $cards[index].value,
      0
    );
    delayTransition(() => energy.set({ ...get(energy), buffer }), 400);
    delayTransition(() => phase.set("match"), 800);
  } else if (get(energy).value > 100) {
    phase.set("extra");
  } else if (get(energy).value < 10) {
    phase.set("gameover");
  } else if (get(log).length > 0) {
    phase.set("total");
  } else {
    phase.set("idle");
  }
}

function doMatchPhase() {
  cards.update(($cards) => getCardsMatched($cards, get(matchedIndexes)));
  matchedIndexes.set([]);
  delayTransition(() => phase.set("fall"), 400);
}

function doFallPhase() {
  cards.update(($cards) => getCardsFallen($cards));
  delayTransition(() => phase.set("blink"), 400);
}

function doExtraPhase() {
  log.update(($log) => $log.concat({ extra: 0 }));
  energy.set({ ...get(energy), buffer: 100 - get(energy).value });
}

function doTotalPhase() {
  score.set({
    ...get(score),
    buffer: get(log).reduce(
      (result, { extra, sum }, index) => result + (index + 1) * (sum || extra),
      0
    ),
  });
  delayTransition(() => phase.set("score"), get(log).length > 1 ? 800 : 0);
}

function doScorePhase() {
  score.set({ ...get(score) });
}

function doGameoverPhase($phase) {
  overlay.set(true);
  delayTransition(() => {
    if ($phase !== "gameover") return;
    energy.set({
      ...get(energy),
      buffer: -get(energy).value,
    });
    score.set({
      ...get(score),
      buffer: get(energy).value,
    });
  }, 400);
}

function doPhaseLogic($phase) {
  Object({
    init: doInitPhase,
    idle: doIdlePhase,
    plus: doPlusPhase,
    blink: doBlinkPhase,
    match: doMatchPhase,
    fall: doFallPhase,
    extra: doExtraPhase,
    total: doTotalPhase,
    score: doScorePhase,
    gameover: doGameoverPhase,
  })[$phase]($phase);
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

function doScoreLogic({ buffer, value }) {
  const $phase = get(phase);
  if ($phase !== "gameover" && $phase !== "score") return;
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
    const { transitions } = get(options);
    score.set({
      buffer: transitions ? buffer - diff : 0,
      value: transitions ? value + diff : value + buffer,
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

function doSeedLogic($seed) {
  if (!$seed) return;
  getNewCardValue = createGetNewCardValue($seed);
  cards.set(getFieldPrepared(getFieldRandom()));
  const $moves = get(moves);
  if (!$moves) return;
  const movesArray = Array.isArray($moves)
    ? $moves
    : getArrayFromBase64($moves);
  if (movesArray.length > 0) {
    moveCount = 0;
    movesInitial = movesArray;
  } else movesInitial = undefined;
}

/* CORE INITIALIZATION ********************************************************/

export function initCore() {
  energy.subscribe(($energy) => doEnergyLogic($energy));
  phase.subscribe(($phase) => doPhaseLogic($phase));
  score.subscribe(($score) => doScoreLogic($score));
  seed.subscribe(($seed) => doSeedLogic($seed));
}
