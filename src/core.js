import { get } from "svelte/store";

import { KEYS, PHASES } from "./constants.js";
import {
  playSoundBleep,
  playSoundBlink,
  playSoundGameOver,
  playSoundKick,
  resetSounds,
} from "./sound.js";
import {
  cards,
  energy,
  leaderboard,
  log,
  matchedIndexes,
  moves,
  options,
  overlay,
  phase,
  plusIndex,
  score,
  seed,
  timestamp,
} from "./stores.js";
import { getArrayFromBase64, getRandom } from "./utils.js";

const { abs, sign, sqrt, trunc } = Math;

let getNextCardValue;
let moveCount = 0;
let movesInitial = null;

function delayTransition(callback, timeout = 0) {
  if (movesInitial === null && get(options).transitions && timeout > 0) {
    setTimeout(callback, timeout);
    return;
  }
  callback();
}

function checkSound(callback) {
  if (
    movesInitial === null &&
    get(options).sound &&
    get(options).transitions &&
    get(phase) !== PHASES.initial
  ) {
    callback();
  }
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
  return Array(6)
    .fill()
    .map(() => Array(12).fill());
}

function getFieldIndexes($cards) {
  const field = getFieldUndefined();
  $cards.forEach(({ x, y }, index) => (field[x][y] = index));
  return field;
}

function getCardsFallen($cards) {
  const { transitions } = get(options);
  const result = [];
  const set = new Set();
  const field = getFieldIndexes($cards);
  field.forEach((col) => {
    let count = 0;
    col.forEach((index, y) => {
      if (index === undefined) return ++count;
      const { x, value } = $cards[index];
      const duration = !movesInitial && transitions ? 100 * sqrt(2 * count) : 0;
      result[index] = {
        x,
        y: y - count,
        value,
        duration,
      };
      if (count > 0 && duration > 0 && !set.has(duration)) set.add(duration);
    });
  });
  checkSound(() =>
    set.forEach((delay) => setTimeout(() => playSoundKick(), delay))
  );
  return result;
}

function getMatchedIndexes($cards) {
  const field = getFieldIndexes($cards);
  let groupedArray = [];
  let count = 0;
  const group = (index) => {
    const { x, y, value } = $cards[index];
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
  $cards.forEach(() => group(count++));
  const groupedObject = groupedArray.reduce(
    (result, { value, group }, index) => ({
      ...result,
      [group]: {
        value,
        indexes: (result[group] ? result[group].indexes : []).concat(index),
      },
    }),
    {}
  );
  return Object.keys(groupedObject).reduce((result, group) => {
    const { value, indexes } = groupedObject[group];
    return value === indexes.length ? result.concat(indexes) : result;
  }, []);
}

function getCardsMatched($cards, matchedIndexes) {
  const counts = [0, 0, 0, 0, 0, 0];
  const getNextY = (nextX) =>
    counts[nextX] +
    $cards
      .filter(({ x }) => x === nextX)
      .sort(({ y: y1 }, { y: y2 }) => y2 - y1)[0].y;
  return $cards.map((card, index) => {
    if (matchedIndexes.includes(index) && card.y < 6) {
      ++counts[card.x];
      return {
        x: card.x,
        y: getNextY(card.x),
        value: getNextCardValue(card.x),
        duration: 0,
      };
    }
    return card;
  });
}

/* CHECK LOGIC ****************************************************************/

function checkLocalScore(key, value) {
  const $leaderboard = get(leaderboard);
  const currentValue = Object.keys($leaderboard[KEYS.local][key] || {})[0] || 0;
  if (value < currentValue) return;
  leaderboard.set({
    ...$leaderboard,
    [KEYS.local]: {
      ...$leaderboard.local,
      [key]: {
        [value]: {
          moves: get(moves),
          playerName: get(options).playerName,
          timestamp: get(timestamp),
        },
      },
    },
  });
}

/* ENERGY LOGIC ***************************************************************/

function getDiffFromBuffer(buffer) {
  return sign(buffer) * trunc(sqrt(abs(buffer)));
}

function doEnergyLogic({ buffer, value }) {
  const $phase = get(phase);
  const diff =
    !movesInitial && get(options).transitions
      ? $phase === PHASES.gameover
        ? sign(buffer)
        : getDiffFromBuffer(buffer)
      : buffer;
  if ($phase === PHASES.extra) {
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
    $phase === PHASES.gameover ? 200 : 20
  );
}

/* PHASE LOGIC ****************************************************************/

function doInitPhase() {
  setTimeout(() => phase.set("idle"));
}

function doIdlePhase() {
  resetSounds();
  if (movesInitial) {
    if (moveCount < movesInitial.length) {
      plusIndex.set(movesInitial[moveCount++]);
      energy.update(({ buffer, value }) => ({ buffer, value: value - 10 }));
      phase.set("plus");
      return;
    }
    movesInitial = null;
    return;
  }
  checkLocalScore(KEYS.highScore, get(score).value);
}

function doPlusPhase() {
  cards.update(($cards) => getCardsPlused($cards, get(plusIndex)));
  plusIndex.set(undefined);
  phase.set("blink");
}

function doBlinkPhase() {
  const $cards = get(cards);
  let nextMatchedIndexes = getMatchedIndexes($cards);
  matchedIndexes.set(nextMatchedIndexes);
  const { value } = get(energy);
  if (nextMatchedIndexes.length > 0) {
    checkSound(playSoundBlink);
    log.update(($log) =>
      $log.concat(
        nextMatchedIndexes.reduce((result, index) => {
          const { value } = $cards[index];
          result[value] = (result[value] || 0) + value;
          result.sum = (result.sum || 0) + value;
          return result;
        }, {})
      )
    );
    const buffer = nextMatchedIndexes.reduce(
      (result, index) => result + $cards[index].value,
      0
    );
    delayTransition(() => energy.set({ buffer, value }), 400);
    delayTransition(() => phase.set("match"), 800);
    return;
  }
  if (value > 100) {
    phase.set("extra");
    return;
  }
  if (value < 10) {
    phase.set("gameover");
    return;
  }
  if (get(log).length > 0) {
    phase.set("total");
    return;
  }
  phase.set("idle");
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
  energy.update(({ value }) => ({ buffer: 100 - value, value }));
  log.update(($log) => $log.concat({ extra: 0 }));
}

function doTotalPhase() {
  const total = get(log).reduce(
    (result, { extra, sum }, index) => result + (index + 1) * (sum || extra),
    0
  );
  checkLocalScore(KEYS.highTotal, total);
  score.update(({ value }) => ({
    buffer: total,
    value,
  }));
  delayTransition(() => phase.set(PHASES.score), get(log).length > 1 ? 800 : 0);
}

function doScorePhase() {
  score.update(($score) => ({ ...$score }));
}

function doGameOverPhase() {
  checkSound(playSoundGameOver);
  overlay.set(true);
  delayTransition(() => {
    energy.update(({ value }) => ({
      buffer: -value,
      value,
    }));
    score.update(({ value }) => ({
      buffer: get(energy).value,
      value,
    }));
  }, 400);
}

function doPhaseLogic($phase) {
  ({
    [PHASES.initial]: doInitPhase,
    [PHASES.idle]: doIdlePhase,
    [PHASES.plus]: doPlusPhase,
    [PHASES.blink]: doBlinkPhase,
    [PHASES.match]: doMatchPhase,
    [PHASES.fall]: doFallPhase,
    [PHASES.extra]: doExtraPhase,
    [PHASES.total]: doTotalPhase,
    [PHASES.score]: doScorePhase,
    [PHASES.gameover]: doGameOverPhase,
  }[$phase]());
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
  if ($phase !== PHASES.gameover && $phase !== PHASES.score) return;
  if (buffer === 0) {
    if ($phase === PHASES.gameover) return;
    return delayTransition(() => {
      log.set([]);
      phase.set("idle");
    }, 200);
  }
  checkSound(playSoundBleep);
  const diff =
    !movesInitial && get(options).transitions
      ? $phase === PHASES.gameover
        ? sign(buffer)
        : getDiffFromBuffer(buffer)
      : buffer;
  delayTransition(
    () => {
      score.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === PHASES.gameover ? 200 : getTimeFromDiff(diff)
  );
}

/* SEED LOGIC *****************************************************************/

function getInitialRandoms(seed) {
  let count = 0,
    result = [getRandom(seed)];
  while (count++ < 5) result = result.concat(getRandom(count * result[0]));
  return result;
}

function createGetNextCardValue(seed) {
  let randoms = getInitialRandoms(seed);
  return (column) => {
    if (column < 0 || 5 < column) return;
    let result = randoms[column];
    randoms[column] = getRandom(result);
    return result % 10;
  };
}

function getFieldRandom() {
  return Array(36)
    .fill(undefined)
    .map((_, index) => ({
      x: trunc(index / 6),
      y: index % 6,
      value: getNextCardValue(trunc(index / 6)),
      duration: 0,
    }));
}

function getFieldPrepared(field) {
  while (true) {
    const matchedIndexes = getMatchedIndexes(field);
    if (matchedIndexes.length === 0) return field;
    field = getCardsFallen(getCardsMatched(field, matchedIndexes));
  }
}

function doSeedLogic($seed) {
  if (!$seed) return;
  getNextCardValue = createGetNextCardValue($seed);
  cards.set(getFieldPrepared(getFieldRandom()));
  const $moves = get(moves);
  if (!$moves) return;
  const movesArray = Array.isArray($moves)
    ? $moves
    : getArrayFromBase64($moves);
  if (movesArray.length > 0) {
    moveCount = 0;
    movesInitial = movesArray;
    return;
  }
  movesInitial = null;
}

/* CORE INITIALIZATION ********************************************************/

export function initCore() {
  energy.subscribe(($energy) => doEnergyLogic($energy));
  phase.subscribe(($phase) => doPhaseLogic($phase));
  score.subscribe(($score) => doScoreLogic($score));
  seed.subscribe(($seed) => doSeedLogic($seed));
}
