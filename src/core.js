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

const { abs, sign, sqrt, trunc } = Math;

/* UTILITIES ******************************************************************/

export function getRandom(prev = 0) {
  return (prev * 16807 + 19487171) % 2147483647;
}

export function getBase64FromArray(array) {
  return btoa(String.fromCodePoint(...array));
}

export function getArrayFromBase64(base64) {
  return Array.from(atob(base64)).map((letter) => letter.charCodeAt());
}

/* CHECK LOGIC ****************************************************************/

export function checkTransition(game, value, timeout = 0) {
  const { transitions } = get(game.options);
  const type = typeof value;
  if (type === "function") {
    return transitions && game.movesInitial === null && timeout > 0
      ? setTimeout(() => value(game), timeout)
      : value(game);
  }
  if (type === "object") {
    return transitions ? value : { duration: 0 };
  }
  return transitions ? value : 0;
}

export function checkSound(game, callback) {
  const { sound, transitions } = get(game.options);
  if (
    !sound ||
    !transitions ||
    game.movesInitial !== null ||
    get(game.phase) === PHASES.initial
  ) {
    return;
  }
  if (Array.isArray(callback)) {
    callback.forEach((cb) => cb());
    return;
  }
  callback();
}

function checkLocalScore(game, type, value) {
  const $records = get(game.records);
  const prevValue = $records[type][KEYS.value];
  if (prevValue >= value) return;
  const { playerName } = get(game.options);
  $records[type] = {
    [KEYS.moves]: get(game.moves),
    [KEYS.playerName]: playerName,
    [KEYS.timestamp]: get(game.timestamp),
    [KEYS.value]: value,
  };
  game.records.set($records);
}

/* CARDS LOGIC ****************************************************************/

function getFieldFromCards($cards) {
  const field = Array.from({ length: 6 }).map(() => Array.from({ length: 12 }));
  $cards.forEach(({ x, y }, index) => (field[x][y] = index));
  return field;
}

function getFallenCards(game, $cards) {
  const field = getFieldFromCards($cards);
  const result = [];
  const set = new Set();
  field.forEach((column) => {
    let count = 0;
    column.forEach((index, y) => {
      if (index === undefined) return ++count;
      const { x, value } = $cards[index];
      const duration =
        !game.movesInitial && get(game.options).transitions
          ? 100 * sqrt(2 * count)
          : 0;
      result[index] = {
        x,
        y: y - count,
        value,
        duration,
      };
      if (count > 0 && duration > 0 && !set.has(duration)) set.add(duration);
    });
  });
  checkSound(game, () =>
    set.forEach((delay) => setTimeout(playSoundKick, delay))
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

function getMatchedCards(game, $cards, $matchedIndexes) {
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
        value: game.getNextCardValue(card.x),
        duration: 0,
      };
    }
    return card;
  });
}

/* ENERGY LOGIC ***************************************************************/

function getDiffFromBuffer(buffer) {
  return sign(buffer) * trunc(sqrt(abs(buffer)));
}

function doEnergyLogic(game, { buffer, value }) {
  const $phase = get(game.phase);
  const diff =
    !game.movesInitial && get(game.options).transitions
      ? $phase === PHASES.gameover
        ? sign(buffer)
        : getDiffFromBuffer(buffer)
      : buffer;
  if ($phase === PHASES.extra) {
    if (buffer === 0) {
      checkTransition(game, () => game.phase.set(PHASES.combo), 800);
      return;
    }
    game.log.update(($log) => {
      const lastIndex = $log.length - 1;
      const { extra } = $log[lastIndex];
      $log[lastIndex] = { extra: extra - diff };
      return $log;
    });
  }
  if (buffer === 0) return;
  checkTransition(
    game,
    () => {
      game.energy.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === PHASES.gameover ? 200 : 20
  );
}

/* PHASE LOGIC ****************************************************************/

function doInitPhase(game) {
  setTimeout(() => game.phase.set(PHASES.idle));
}

function doIdlePhase(game) {
  if (game.movesInitial) {
    if (game.moveCount < game.movesInitial.length) {
      game.plusIndex.set(game.movesInitial[game.moveCount++]);
      game.energy.update(({ buffer, value }) => ({
        buffer,
        value: value - 10,
      }));
      game.phase.set(PHASES.plus);
      return;
    }
    game.movesInitial = null;
    checkLocalScore(game, KEYS.highScore, get(game.score).value);
    return;
  }
  checkLocalScore(game, KEYS.highScore, get(game.score).value);
  checkSound(game, resetSounds);
}

function doPlusPhase(game) {
  game.plusIndex.update(($plusIndex) => {
    game.cards.update(($cards) => {
      const card = $cards[$plusIndex];
      if (card) {
        card.value = card.value < 9 ? card.value + 1 : 0;
        card.duration = 0;
      }
      return $cards;
    });
    return undefined;
  });
  game.phase.set(PHASES.blink);
}

function doBlinkPhase(game) {
  const $cards = get(game.cards);
  let nextMatchedIndexes = getMatchedIndexes($cards);
  game.matchedIndexes.set(nextMatchedIndexes);
  const { value } = get(game.energy);
  if (nextMatchedIndexes.length > 0) {
    game.log.update(($log) =>
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
    checkTransition(game, () => game.energy.set({ buffer, value }), 400);
    checkTransition(game, () => game.phase.set(PHASES.match), 800);
    checkSound(game, [playSoundWordUp, playSoundBlink]);
    return;
  }
  if (value > 100) {
    game.phase.set(PHASES.extra);
    return;
  }
  if (get(game.log).length > 0) {
    game.phase.set(PHASES.combo);
    return;
  }
  if (value < 10) {
    game.phase.set(PHASES.gameover);
    return;
  }
  game.phase.set(PHASES.idle);
}

function doMatchPhase(game) {
  game.matchedIndexes.update(($matchedIndexes) => {
    game.cards.update(($cards) =>
      getMatchedCards(game, $cards, $matchedIndexes)
    );
    return [];
  });
  checkTransition(game, () => game.phase.set(PHASES.fall), 400);
}

function doFallPhase(game) {
  game.cards.update(($cards) => getFallenCards(game, $cards));
  checkTransition(game, () => game.phase.set(PHASES.blink), 400);
}

function doExtraPhase(game) {
  game.energy.update(({ value }) => ({ buffer: 100 - value, value }));
  game.log.update(($log) => {
    $log.push({ extra: 0 });
    return $log;
  });
  checkSound(game, playSoundWordUp);
}

function doComboPhase(game) {
  const combo = get(game.log).reduce(
    (result, { extra, sum }, index) => result + (index + 1) * (sum || extra),
    0
  );
  game.score.update(({ value }) => ({
    buffer: combo,
    value,
  }));
  checkLocalScore(game, KEYS.highCombo, combo);
  checkTransition(
    game,
    () => game.phase.set(PHASES.score),
    get(game.log).length > 1 ? 800 : 0
  );
  checkSound(game, playSoundWordUp);
}

function doScorePhase(game) {
  if (get(game.log).length < 2) return;
  game.score.update(($score) => ({ ...$score }));
}

function doGameOverPhase(game) {
  game.overlay.set(true);
  checkTransition(
    game,
    () => {
      if (!get(game.overlay)) return;
      game.energy.update(({ value }) => ({
        buffer: -value,
        value,
      }));
      game.score.update(({ value }) => ({
        buffer: get(game.energy).value,
        value,
      }));
    },
    400
  );
  checkSound(game, playSoundGameOver);
}

const PHASE_LOGICS = {
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
};

function doPhaseLogic(game, $phase) {
  PHASE_LOGICS[$phase](game);
}

/* PLUS INDEX LOGIC ***********************************************************/

function doPlusIndexLogic(game, $plusIndex) {
  if ($plusIndex === undefined || game.movesInitial !== null) return;
  let $moves = get(game.moves);
  $moves = Array.isArray($moves) ? $moves : getArrayFromBase64($moves);
  $moves.push($plusIndex);
  game.moves.set(getBase64FromArray($moves));
  game.energy.update(($energy) => ({ ...$energy, buffer: -10 }));
  checkTransition(game, () => game.phase.set(PHASES.plus), 400);
  checkSound(game, playSoundCardPlus);
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

function doScoreLogic(game, { buffer, value }) {
  const $phase = get(game.phase);
  if ($phase !== PHASES.gameover && $phase !== PHASES.score) return;
  if (buffer === 0) {
    if ($phase === PHASES.gameover) {
      checkLocalScore(game, KEYS.highScore, value);
      return;
    }
    checkTransition(
      game,
      () => {
        game.log.set([]);
        game.phase.set(
          get(game.energy).value < 10 ? PHASES.gameover : PHASES.idle
        );
        checkSound(game, playSoundFadeIn);
      },
      200
    );
    return;
  }
  const diff =
    !game.movesInitial && get(game.options).transitions
      ? $phase === PHASES.gameover
        ? sign(buffer)
        : getDiffFromBuffer(buffer)
      : buffer;
  checkTransition(
    game,
    () => {
      game.score.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === PHASES.gameover ? 200 : getTimeFromDiff(diff)
  );
  checkSound(game, playSoundBleep);
}

/* SEED LOGIC *****************************************************************/

export function hash(...args) {
  const { MAX_SAFE_INTEGER } = Number;
  return args.reduce((result, item) => {
    const number = parseInt(`${result}${item}`, 10);
    return number > MAX_SAFE_INTEGER ? number % MAX_SAFE_INTEGER : number;
  }, 0);
}

export function getSeed({ playerName, timestamp }) {
  return (
    playerName &&
    typeof playerName === "string" &&
    timestamp &&
    typeof timestamp === "number" &&
    timestamp < Infinity &&
    hash(
      timestamp,
      ...Array.from(playerName).map((letter) => letter.charCodeAt())
    )
  );
}

function getInitialRandoms($seed) {
  let count = 0;
  const result = [getRandom($seed)];
  while (count < 5) result.push(getRandom(2 * result[count++]));
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

function getInitialCards(game) {
  return Array.from({ length: 36 }).map((_, index) => ({
    x: trunc(index / 6),
    y: index % 6,
    value: game.getNextCardValue(trunc(index / 6)),
    duration: 0,
  }));
}

function getPreparedCards(game, $cards) {
  while (true) {
    const $matchedIndexes = getMatchedIndexes($cards);
    if ($matchedIndexes.length === 0) return $cards;
    $cards = getFallenCards(
      game,
      getMatchedCards(game, $cards, $matchedIndexes)
    );
  }
}

function doSeedLogic(game, $seed) {
  if (!$seed) return;
  game.getNextCardValue = createGetNextCardValue($seed);
  game.cards.set(getPreparedCards(game, getInitialCards(game)));
  const $moves = get(game.moves);
  if (!$moves) return;
  const movesArray = Array.isArray($moves)
    ? $moves
    : getArrayFromBase64($moves);
  if (movesArray.length > 0) {
    game.moveCount = 0;
    game.movesInitial = movesArray;
    return;
  }
  game.movesInitial = null;
}

/* CORE INITIALIZATION ********************************************************/

function updatePreviousScore(game) {
  const $records = get(game.records);
  game[KEYS.prevHighCombo] = $records[KEYS.highCombo][KEYS.value];
  game[KEYS.prevHighScore] = $records[KEYS.highScore][KEYS.value];
}

export function initCore(game) {
  updatePreviousScore(game);
  game.getNextCardValue = () => 0;
  game.moveCount = 0;
  game.movesInitial = null;
  game.energy.subscribe(($energy) => doEnergyLogic(game, $energy));
  game.phase.subscribe(($phase) => doPhaseLogic(game, $phase));
  game.plusIndex.subscribe(($plusIndex) => doPlusIndexLogic(game, $plusIndex));
  game.score.subscribe(($score) => doScoreLogic(game, $score));
  game.seed.subscribe(($seed) => doSeedLogic(game, $seed));
  return game;
}

/* GAME RESET *****************************************************************/

function shuffleBoard(game, count) {
  game.phase.set(INITIAL_VALUES.phase);
  game.energy.set(INITIAL_VALUES.energy);
  game.log.set(INITIAL_VALUES.log);
  game.matchedIndexes.set(INITIAL_VALUES.matchedIndexes);
  game.moves.set(INITIAL_VALUES.moves);
  game.plusIndex.set(INITIAL_VALUES.plusIndex);
  game.score.set(INITIAL_VALUES.score);
  game.timestamp.set(Date.now());
  if (count-- > 0) setTimeout(() => shuffleBoard(game, count), 64);
}

export function resetGame(game, showOverlay = false, count = 8) {
  checkSound(game, playSoundGenerate);
  updatePreviousScore(game);
  game.overlay.set(showOverlay);
  game.randomColor.set(INITIAL_VALUES.randomColor);
  const { playerName, transitions } = get(game.options);
  shuffleBoard(game, playerName && transitions ? count : 0);
}
