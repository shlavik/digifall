export const COLORS = {
  white: "white",
};

export const KEYS = {
  digifall: "digifall",
  highCombo: "highCombo",
  highScore: "highScore",
  leaderboard: "leaderboard",
  local: "local",
  moves: "moves",
  options: "options",
  peerId: "peerId",
  playerName: "playerName",
  records: "records",
  score: "score",
  timestamp: "timestamp",
  type: "type",
  value: "value",
};

export const OVERLAYS = {
  gameover: "gameover",
  leaderboard: "leaderboard",
  menu: "menu",
  options: "options",
  wellcome: "wellcome",
};

export const PHASES = {
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
};

export const INITIAL_VALUES = {
  cards: [],
  energy: {
    buffer: 0,
    value: 100,
  },
  [KEYS.leaderboard]: {
    [KEYS.highScore]: [],
    [KEYS.highCombo]: [],
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
};
