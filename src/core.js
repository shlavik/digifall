import { get } from "svelte/store";

import { CORE, INITIAL_VALUES, KEYS, PHASES } from "./constants.js";

const { abs, sign, trunc } = Math;

// UTILITIES ///////////////////////////////////////////////////////////////////

export function getRandom(prev = 0) {
  return (prev * 16807 + 19487171) % 2147483647;
}

/**
 * @param {number[]} array
 */
export function getBase64FromArray(array) {
  return btoa(String.fromCodePoint(...array));
}

/**
 * @param {string} base64
 */
export function getArrayFromBase64(base64) {
  return Array.from(atob(base64)).map((letter) => letter.charCodeAt());
}

/**
 * Squash integers into safe one pseudo hash
 * @param {number[]} integers
 */
export function squashIntegers(integers) {
  const SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
  const pseudoHash = integers.reduce((result, integer) => {
    result = BigInt(`${result}${integer}`);
    if (result > SAFE_BIGINT) result = result % SAFE_BIGINT;
    return result;
  }, 0);
  return Number(pseudoHash);
}

// CHECK LOGIC /////////////////////////////////////////////////////////////////

export function checkSpeedrun(game, value, timeout = 0) {
  const { speedrun } = get(game.options);
  const insta = !speedrun && game.movesInitial === null && timeout > 0;
  switch (typeof value) {
    case "undefined":
      return { duration: insta ? 0 : 400 };
    case "function":
      return insta ? setTimeout(() => value(game), timeout) : value(game);
    case "object":
      return insta ? { duration: 0 } : value;
    default:
      return insta ? 0 : value;
  }
}

export function checkSound(game, callback) {
  const { sound, speedrun } = get(game.options);
  if (!sound || speedrun || game.movesInitial !== null) return;
  if (Array.isArray(callback)) {
    callback.forEach((cb) => cb());
    return;
  }
  callback();
}

function checkLocalScore(game, type, value) {
  const $records = get(game.records);
  const valuePrev = $records[type][KEYS.value];
  if (valuePrev >= value) return;
  $records[type] = {
    [KEYS.moves]: get(game.moves),
    [KEYS.playerName]: get(game.options).playerName,
    [KEYS.timestamp]: get(game.timestamp),
    [KEYS.value]: value,
  };
  game.records.set($records);
}

// CARDS LOGIC /////////////////////////////////////////////////////////////////

function getFieldFromCards($cards) {
  const field = Array.from({ length: CORE.columns }, () =>
    Array.from({ length: 2 * CORE.rows })
  );
  $cards.forEach(({ x, y }, index) => (field[x][y] = index));
  return field;
}

function getFallenCards(game, $cards) {
  const $phase = get(game.phase);
  const { speedrun } = get(game.options);
  const field = getFieldFromCards($cards);
  const result = [];
  const set = new Set();
  field.forEach((column) => {
    let count = 0;
    column.forEach((index, y) => {
      if (index === undefined) return ++count;
      const { x, value } = $cards[index];
      const duration =
        speedrun || game.movesInitial || $phase !== PHASES.fall
          ? 0
          : 100 * (2 * count) ** 0.5;
      result[index] = {
        x,
        y: y - count,
        value,
        duration,
      };
      if (count > 0 && duration > 0 && !set.has(duration)) set.add(duration);
    });
  });
  if (game.sounds) {
    checkSound(game, () =>
      set.forEach((delay) => setTimeout(game.sounds.playKick, delay))
    );
  }
  return result;
}

function getMatchedFromCards($cards) {
  const field = getFieldFromCards($cards);
  const escape = new Set();
  const groups = [];
  const assort = (group, index, currentValue) => {
    if (escape.has(index)) return;
    const { x, y, value } = $cards[index];
    if (currentValue !== undefined && currentValue !== value) return;
    if (!groups[group]) groups[group] = { value, indexes: new Set() };
    groups[group].indexes.add(index);
    escape.add(index);
    if (y < CORE.columns - 1) assort(group, field[x][y + 1], value);
    if (x < CORE.columns - 1) assort(group, field[x + 1][y], value);
    if (y > 0) assort(group, field[x][y - 1], value);
    if (x > 0) assort(group, field[x - 1][y], value);
  };
  $cards.forEach((_, index) => assort(index, index));
  return groups.reduce(
    (result, group) => {
      if (group.value === group.indexes.size) {
        result.counts++;
        result.digits.add(group.value);
        group.indexes.forEach(result.indexes.add, result.indexes);
      }
      return result;
    },
    {
      counts: 0,
      digits: new Set(),
      indexes: new Set(),
    }
  );
}

function getMatchedCards(game, $cards, $matchedIndexes) {
  const counts = [0, 0, 0, 0, 0, 0];
  const getNextY = (nextX) =>
    counts[nextX] +
    $cards
      .filter(({ x }) => x === nextX)
      .sort(({ y: y1 }, { y: y2 }) => y2 - y1)[0].y;
  return $cards.map((card, index) => {
    if (card.y < CORE.rows && $matchedIndexes.has(index)) {
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

// ENERGY LOGIC ////////////////////////////////////////////////////////////////

function getDiffFromBuffer(buffer) {
  return sign(buffer) * trunc(abs(buffer) ** 0.5);
}

function doEnergyLogic(game, { buffer, value }) {
  const $phase = get(game.phase);
  const { speedrun } = get(game.options);
  const diff =
    speedrun || game.movesInitial
      ? buffer
      : $phase === PHASES.gameover
      ? sign(buffer)
      : getDiffFromBuffer(buffer);
  if ($phase === PHASES.extra) {
    if (buffer === 0) {
      checkSpeedrun(game, () => game.phase.set(PHASES.combo), 800);
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
  checkSpeedrun(
    game,
    () => {
      game.energy.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === PHASES.gameover ? 200 : 32
  );
}

// PHASE LOGIC /////////////////////////////////////////////////////////////////

function doInitialPhase(game) {
  setTimeout(() => game.phase.set(PHASES.idle), 0);
}

function doIdlePhase(game) {
  if (game.movesInitial !== null) {
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
  game.cards.update(($cards) =>
    $cards.map((card) => ((card.duration = 0), card))
  );
  checkLocalScore(game, KEYS.highScore, get(game.score).value);
  if (game.sounds) checkSound(game, game.sounds.reset);
}

function doPlusPhase(game) {
  game.plusIndex.update(($plusIndex) => {
    game.cards.update(($cards) => {
      return $cards.map((card, index) => {
        return index === $plusIndex
          ? {
              ...card,
              value: card.value < 9 ? card.value + 1 : 0,
              duration: 0,
            }
          : card;
      });
    });
    return undefined;
  });
  game.phase.set(PHASES.blink);
}

function doBlinkPhase(game) {
  const $cards = get(game.cards);
  let { counts, digits, indexes } = getMatchedFromCards($cards);
  game.matchedIndexes.set(indexes);
  const { value } = get(game.energy);
  if (indexes.size > 0) {
    const indexesArray = Array.from(indexes);
    game.log.update(($log) =>
      $log.concat(
        indexesArray.reduce((result, index) => {
          const card = $cards[index];
          result[card.value] = (result[card.value] || 0) + card.value;
          result.sum = (result.sum || 0) + card.value;
          result.counts = counts;
          result.digits = Array.from(digits);
          return result;
        }, {})
      )
    );
    const buffer = indexesArray.reduce(
      (result, index) => result + $cards[index].value,
      0
    );
    checkSpeedrun(game, () => game.energy.set({ buffer, value }), 400);
    checkSpeedrun(game, () => game.phase.set(PHASES.match), 800);
    if (game.sounds) {
      checkSound(game, [game.sounds.playWordUp, game.sounds.playBlink]);
    }
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
    return new Set();
  });
  checkSpeedrun(game, () => game.phase.set(PHASES.fall), 400);
}

function doFallPhase(game) {
  game.cards.update(($cards) => getFallenCards(game, $cards));
  checkSpeedrun(game, () => game.phase.set(PHASES.blink), 400);
}

function doExtraPhase(game) {
  game.energy.update(({ value }) => ({ buffer: 100 - value, value }));
  game.log.update(($log) => $log.concat({ extra: 100 }));
  if (game.sounds) checkSound(game, game.sounds.playWordUp);
}

function doComboPhase(game) {
  const $log = get(game.log);
  const combo = $log.reduce(
    (result, { counts, extra, sum }, index) =>
      result + (index + 1) * (sum || extra) * (counts || 1),
    0
  );
  game.score.update(({ value }) => ({
    buffer: combo,
    value,
  }));
  checkLocalScore(game, KEYS.highCombo, combo);
  checkSpeedrun(
    game,
    () => game.phase.set(PHASES.score),
    $log.length > 1 ? 800 : 0
  );
  if (game.sounds) checkSound(game, game.sounds.playWordUp);
}

function doScorePhase(game) {
  if (get(game.log).length < 2) return;
  game.score.update(($score) => ({ ...$score }));
}

function doGameOverPhase(game) {
  checkSpeedrun(
    game,
    () => {
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
  if (game.sounds) checkSound(game, game.sounds.playGameOver);
}

const PHASE_LOGICS = {
  [PHASES.initial]: doInitialPhase,
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

// PLUS INDEX LOGIC ////////////////////////////////////////////////////////////

function doPlusIndexLogic(game, $plusIndex) {
  if ($plusIndex === undefined || game.movesInitial !== null) return;
  let $moves = get(game.moves);
  $moves = Array.isArray($moves) ? $moves : getArrayFromBase64($moves);
  $moves.push($plusIndex);
  game.moves.set(getBase64FromArray($moves));
  game.energy.update(($energy) => ({ ...$energy, buffer: -10 }));
  checkSpeedrun(game, () => game.phase.set(PHASES.plus), 400);
  if (game.sounds) checkSound(game, game.sounds.playCardPlus);
}

// SCORE LOGIC /////////////////////////////////////////////////////////////////

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
    checkSpeedrun(
      game,
      () => {
        game.log.set([]);
        game.phase.set(
          get(game.energy).value < 10 ? PHASES.gameover : PHASES.idle
        );
        if (game.sounds) checkSound(game, game.sounds.playFadeIn);
      },
      200
    );
    return;
  }
  const { speedrun } = get(game.options);
  const diff =
    speedrun || game.movesInitial
      ? buffer
      : $phase === PHASES.gameover
      ? sign(buffer)
      : getDiffFromBuffer(buffer);
  checkSpeedrun(
    game,
    () => {
      game.score.set({
        buffer: buffer - diff,
        value: value + diff,
      });
    },
    $phase === PHASES.gameover ? 200 : getTimeFromDiff(diff)
  );
  if (game.sounds) checkSound(game, game.sounds.playBleep);
}

// SEED LOGIC //////////////////////////////////////////////////////////////////

export function getSeed({ playerName, timestamp }) {
  return (
    playerName &&
    typeof playerName === "string" &&
    timestamp &&
    typeof timestamp === "number" &&
    timestamp < Infinity &&
    squashIntegers([
      timestamp,
      ...Array.from(playerName).map((letter) => letter.charCodeAt()),
    ])
  );
}

function getInitialRandoms($seed) {
  let count = 0;
  const result = [getRandom($seed)];
  while (count < CORE.columns - 1) result.push(getRandom(2 * result[count++]));
  return result;
}

function createGetNextCardValue($seed) {
  let randoms = getInitialRandoms($seed);
  return (column) => {
    if (column < 0 || CORE.columns - 1 < column) return;
    let result = randoms[column];
    randoms[column] = getRandom(result);
    return result % 10;
  };
}

function getInitialCards(game) {
  return Array.from(
    { length: CORE.columns * CORE.rows },
    (_, index, x) => (
      (x = trunc(index / CORE.columns)),
      {
        x,
        y: index % CORE.rows,
        value: game.getNextCardValue(x),
        duration: 0,
      }
    )
  );
}

function getPreparedCards(game, $cards) {
  while (true) {
    const $matchedIndexes = getMatchedFromCards($cards).indexes;
    if ($matchedIndexes.size === 0) return $cards;
    const matchedCards = getMatchedCards(game, $cards, $matchedIndexes);
    $cards = getFallenCards(game, matchedCards);
  }
}

function doSeedLogic(game, $seed) {
  if (!$seed) return;
  game.getNextCardValue = createGetNextCardValue($seed);
  game.cards.set(getPreparedCards(game, getInitialCards(game)));
  let $moves = get(game.moves);
  if (!$moves) return;
  $moves = Array.isArray($moves) ? $moves : getArrayFromBase64($moves);
  if ($moves.length > 0) {
    game.moveCount = 0;
    game.movesInitial = $moves;
    return;
  }
  game.movesInitial = null;
}

// CORE INITIALIZATION /////////////////////////////////////////////////////////

function updatePreviousHighs(game) {
  const $records = get(game.records);
  game[KEYS.highComboPrev] = $records[KEYS.highCombo][KEYS.value];
  game[KEYS.highScorePrev] = $records[KEYS.highScore][KEYS.value];
}

export function initCore(game, sounds) {
  if (sounds) game.sounds = sounds;
  updatePreviousHighs(game);
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

// GAME RESET //////////////////////////////////////////////////////////////////

function shuffleBoard(game, count, playerName) {
  if (count < 0) return;
  setTimeout(() => {
    game.log.set(INITIAL_VALUES.log);
    game.plusIndex.set(INITIAL_VALUES.plusIndex);
    game.matchedIndexes.set(INITIAL_VALUES.matchedIndexes);
    game.moves.set(INITIAL_VALUES.moves);
    game.score.set(INITIAL_VALUES.score);
    game.energy.set(INITIAL_VALUES.energy);
    game.phase.set(INITIAL_VALUES.phase);
    game.timestamp.set(Date.now());
    shuffleBoard(game, --count);
    if (!playerName) return;
    game.options.update(($options) => ({ ...$options, playerName }));
  }, 64);
}

export function resetGame(game, playerName) {
  updatePreviousHighs(game);
  if (game.sounds) checkSound(game, game.sounds.playGenerate);
  const { speedrun } = get(game.options);
  shuffleBoard(game, speedrun ? 0 : 8, playerName);
}
