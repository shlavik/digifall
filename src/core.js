import { get } from "svelte/store";

import { INITIAL_VALUES, KEYS, PHASES } from "./constants.js";
import {
  playSoundBleep,
  playSoundBlink,
  playSoundCardPlus,
  playSoundFadeIn,
  playSoundGameOver,
  playSoundGenerate,
  playSoundKick,
  playSoundWordUp,
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
  randomColor,
  score,
  seed,
  timestamp,
} from "./stores.js";

const { abs, sign, sqrt, trunc } = Math;

let getNextCardValue = () => 0;
let moveCount = 0;
let movesInitial = null;

export function checkTransition(value, timeout = 0) {
  const { transitions } = get(options);
  if (typeof value === "function") {
    return transitions && movesInitial === null && timeout > 0
      ? setTimeout(value, timeout)
      : value();
  }
  if (typeof value === "object") {
    return transitions ? value : { duration: 0 };
  }
  return transitions ? value : 0;
}

export function checkSound(callback) {
  if (
    movesInitial !== null ||
    get(options).sound === false ||
    get(phase) === PHASES.initial
  ) {
    return;
  }
  if (Array.isArray(callback)) {
    callback.forEach((cb) => cb());
    return;
  }
  callback();
}

export function getRandom(previous = 0) {
  return (previous * 16807 + 19487171) % 2147483647;
}

export function getBase64FromArray(array) {
  return btoa(String.fromCodePoint(...array));
}

export function getArrayFromBase64(base64) {
  return Array.from(atob(base64)).map((letter) => letter.charCodeAt());
}

/* CARDS LOGIC ****************************************************************/

function getFieldFromCards($cards) {
  const field = Array(6)
    .fill()
    .map(() => Array(12).fill());
  $cards.forEach(({ x, y }, index) => (field[x][y] = index));
  return field;
}

function getCardsFallen($cards) {
  const field = getFieldFromCards($cards);
  const { transitions } = get(options);
  const result = [];
  const set = new Set();
  field.forEach((column) => {
    let count = 0;
    column.forEach((index, y) => {
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
  const field = getFieldFromCards($cards);
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
    (result, { value, group }, index) => {
      const indexes = result[group] ? result[group].indexes : [];
      indexes.push(index);
      result[group] = {
        value,
        indexes,
      };
      return result;
    },
    {}
  );
  const matchedIndexes = Object.keys(groupedObject).reduce((result, group) => {
    const { value, indexes } = groupedObject[group];
    if (value === indexes.length) result.push(...indexes);
    return result;
  }, []);
  return matchedIndexes;
}

function getMatchedCards($cards, $matchedIndexes) {
  const counts = [0, 0, 0, 0, 0, 0];
  const getNextY = (nextX) =>
    counts[nextX] +
    $cards
      .filter(({ x }) => x === nextX)
      .sort(({ y: y1 }, { y: y2 }) => y2 - y1)[0].y;
  return $cards.map((card, index) => {
    if (card.y < 6 && $matchedIndexes.includes(index)) {
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
      ...$leaderboard[KEYS.local],
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
    if (buffer === 0) {
      checkTransition(() => phase.set(PHASES.combo), 800);
      return;
    }
    log.update(($log) => {
      const lastIndex = $log.length - 1;
      const { extra } = $log[lastIndex];
      $log[lastIndex] = { extra: extra - diff };
      return $log;
    });
  }
  if (buffer === 0) return;
  checkTransition(
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
  setTimeout(() => phase.set(PHASES.idle));
}

function doIdlePhase() {
  if (movesInitial) {
    if (moveCount < movesInitial.length) {
      plusIndex.set(movesInitial[moveCount++]);
      energy.update(({ buffer, value }) => ({ buffer, value: value - 10 }));
      phase.set(PHASES.plus);
      return;
    }
    movesInitial = null;
    return;
  }
  checkLocalScore(KEYS.highScore, get(score).value);
  checkSound(resetSounds);
}

function doPlusPhase() {
  plusIndex.update(($plusIndex) => {
    cards.update(($cards) => {
      const card = $cards[$plusIndex];
      if (card) {
        card.value = card.value < 9 ? card.value + 1 : 0;
        card.duration = 0;
      }
      return $cards;
    });
    return undefined;
  });
  phase.set(PHASES.blink);
}

function doBlinkPhase() {
  const $cards = get(cards);
  let nextMatchedIndexes = getMatchedIndexes($cards);
  matchedIndexes.set(nextMatchedIndexes);
  const { value } = get(energy);
  if (nextMatchedIndexes.length > 0) {
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
    checkTransition(() => energy.set({ buffer, value }), 400);
    checkTransition(() => phase.set(PHASES.match), 800);
    checkSound([playSoundWordUp, playSoundBlink]);
    return;
  }
  if (value > 100) {
    phase.set(PHASES.extra);
    return;
  }
  if (get(log).length > 0) {
    phase.set(PHASES.combo);
    return;
  }
  if (value < 10) {
    phase.set(PHASES.gameover);
    return;
  }
  phase.set(PHASES.idle);
}

function doMatchPhase() {
  matchedIndexes.update(($matchedIndexes) => {
    cards.update(($cards) => getMatchedCards($cards, $matchedIndexes));
    return [];
  });
  checkTransition(() => phase.set(PHASES.fall), 400);
}

function doFallPhase() {
  cards.update(($cards) => getCardsFallen($cards));
  checkTransition(() => phase.set(PHASES.blink), 400);
}

function doExtraPhase() {
  energy.update(({ value }) => ({ buffer: 100 - value, value }));
  log.update(($log) => {
    $log.push({ extra: 0 });
    return $log;
  });
  checkSound(playSoundWordUp);
}

function doComboPhase() {
  const combo = get(log).reduce(
    (result, { extra, sum }, index) => result + (index + 1) * (sum || extra),
    0
  );
  score.update(({ value }) => ({
    buffer: combo,
    value,
  }));
  checkLocalScore(KEYS.highCombo, combo);
  checkTransition(() => phase.set(PHASES.score), get(log).length > 1 ? 800 : 0);
  checkSound(playSoundWordUp);
}

function doScorePhase() {
  if (get(log).length > 1) {
    score.update(($score) => ({ ...$score }));
  }
}

function doGameOverPhase() {
  overlay.set(true);
  checkTransition(() => {
    if (!get(overlay)) return;
    energy.update(({ value }) => ({
      buffer: -value,
      value,
    }));
    score.update(({ value }) => ({
      buffer: get(energy).value,
      value,
    }));
  }, 400);
  checkSound(playSoundGameOver);
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
    [PHASES.combo]: doComboPhase,
    [PHASES.score]: doScorePhase,
    [PHASES.gameover]: doGameOverPhase,
  }[$phase]());
}

/* PLUS INDEX LOGIC ***********************************************************/

function doPlusIndexLogic($plusIndex) {
  $plusIndex !== undefined && checkSound(playSoundCardPlus);
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
    checkTransition(() => {
      log.set([]);
      phase.set(get(energy).value < 10 ? PHASES.gameover : PHASES.idle);
      checkSound(playSoundFadeIn);
    }, 200);
    return;
  }
  const diff =
    !movesInitial && get(options).transitions
      ? $phase === PHASES.gameover
        ? sign(buffer)
        : getDiffFromBuffer(buffer)
      : buffer;
  checkTransition(
    () => {
      score.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === PHASES.gameover ? 200 : getTimeFromDiff(diff)
  );
  checkSound(playSoundBleep);
}

/* SEED LOGIC *****************************************************************/

function getInitialRandoms($seed) {
  let count = 0;
  const result = [getRandom($seed)];
  while (count++ < 5) result.push(getRandom(count * result[0]));
  return result;
}

function createGetNextCardValue($seed) {
  let randoms = getInitialRandoms($seed);
  return (column) => {
    if (column < 0 || 5 < column) return;
    let result = randoms[column];
    randoms[column] = getRandom(result);
    return result % 10;
  };
}

function getInitialCards() {
  return Array(36)
    .fill()
    .map((_, index) => ({
      x: trunc(index / 6),
      y: index % 6,
      value: getNextCardValue(trunc(index / 6)),
      duration: 0,
    }));
}

function getPreparedCards($cards) {
  while (true) {
    const $matchedIndexes = getMatchedIndexes($cards);
    if ($matchedIndexes.length === 0) return $cards;
    $cards = getCardsFallen(getMatchedCards($cards, $matchedIndexes));
  }
}

function doSeedLogic($seed) {
  if (!$seed) return;
  getNextCardValue = createGetNextCardValue($seed);
  cards.set(getPreparedCards(getInitialCards()));
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
  plusIndex.subscribe(($plusIndex) => doPlusIndexLogic($plusIndex));
  score.subscribe(($score) => doScoreLogic($score));
  seed.subscribe(($seed) => doSeedLogic($seed));
}

/* GAME INITIALIZATION ********************************************************/

function shuffleBoard(count) {
  phase.set(INITIAL_VALUES.phase);
  log.set(INITIAL_VALUES.log);
  matchedIndexes.set(INITIAL_VALUES.matchedIndexes);
  moves.set(INITIAL_VALUES.moves);
  plusIndex.set(INITIAL_VALUES.plusIndex);
  randomColor.set(INITIAL_VALUES.randomColor);
  score.set(INITIAL_VALUES.score);
  timestamp.set(Date.now());
  if (count-- > 0) setTimeout(() => shuffleBoard(count), 64);
}

export function initGame(showOverlay = false, count = 8) {
  checkSound(playSoundGenerate);
  energy.set(INITIAL_VALUES.energy);
  overlay.set(showOverlay);
  const { playerName, transitions } = get(options);
  shuffleBoard(playerName && transitions ? count : 0);
}
