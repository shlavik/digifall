export const COLORS = Object.freeze({
  white: "white",
});

export const KEYS = Object.freeze({
  digifall: "digifall",
  highCombo: "highCombo",
  highComboPrev: "highComboPrev",
  highScore: "highScore",
  highScorePrev: "highScorePrev",
  leaderboard: "leaderboard",
  local: "local",
  moves: "moves",
  options: "options",
  peerId: "peerId",
  playerName: "playerName",
  records: "records",
  rootHash: "rootHash",
  score: "score",
  timestamp: "timestamp",
  type: "type",
  value: "value",
});

export const OVERLAYS = Object.freeze({
  gameover: "gameover",
  leaderboard: "leaderboard",
  menu: "menu",
  options: "options",
  wellcome: "wellcome",
});

export const PHASES = Object.freeze({
  blink: "blink",
  combo: "combo",
  extra: "extra",
  fall: "fall",
  gameover: "gameover",
  idle: "idle",
  initial: "initial",
  match: "match",
  plus: "plus",
  score: "score",
});

export const INITIAL_VALUES = Object.freeze({
  cards: [],
  energy: {
    buffer: 0,
    value: 100,
  },
  [KEYS.leaderboard]: {
    [KEYS.highScore]: [],
    [KEYS.highCombo]: [],
    [KEYS.rootHash]: {
      [KEYS.highScore]: 0,
      [KEYS.highCombo]: 0,
    },
  },
  log: [],
  matchedIndexes: new Set(),
  [KEYS.moves]: "",
  [KEYS.options]: {
    [KEYS.playerName]: "",
    [KEYS.leaderboard]: true,
    seedground: true,
    speedrun: false,
    sound: true,
  },
  overlay: OVERLAYS.menu,
  phase: PHASES.initial,
  plusIndex: undefined,
  randomColor: COLORS.white,
  [KEYS.records]: {
    [KEYS.highScore]: {
      [KEYS.playerName]: "",
      [KEYS.timestamp]: 0,
      [KEYS.moves]: "",
      [KEYS.value]: 0,
    },
    [KEYS.highCombo]: {
      [KEYS.playerName]: "",
      [KEYS.timestamp]: 0,
      [KEYS.moves]: "",
      [KEYS.value]: 0,
    },
  },
  [KEYS.score]: {
    buffer: 0,
    value: 0,
  },
});
