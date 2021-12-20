export const COLORS = {
  white: "white",
};

export const CSS_STYLES = {
  none: "none",
  transparent: "0 0 0 transparent",
  gloss: "0 -1px 0 white",
  glossInset: "0 1px 0 white",
  glow: "0 0 1px white",
  shadow0: "0 0 1px black",
  shadow1: "0 0.5rem 0.5rem var(--color-black-04)",
  shadow2: "0 1rem 1rem var(--color-black-04)",
  shadow3: "0 0 3rem 2rem var(--color-black-04)",
  shadowInset: "inset 0 0.5rem 0.5rem var(--color-black-04)",
};

export const CSS_VARS = {
  colorBase: "--color-base",
  colorZero: "--color-zero",
  colorDark: "--color-dark",
  colorBody: "--color-body",
  colorBlack04: "--color-black-04",
  colorBlack08: "--color-black-08",
  gloss: "--gloss",
  glossInset: "--gloss-inset",
  glow: "--glow",
  pixel: "--pixel",
  shadow0: "--shadow-0",
  shadow1: "--shadow-1",
  shadow2: "--shadow-2",
  shadow3: "--shadow-3",
  shadowInset: "--shadow-inset",
};

export const KEYS = {
  highCombo: "hi-combo",
  highScore: "hi-score",
  leaderboard: "leaderboard",
  local: "local",
  moves: "moves",
  options: "options",
  playerName: "playerName",
  score: "score",
  timestamp: "timestamp",
};

export const MENU = {
  main: "main",
  name: "name",
  newGame: "new game",
  options: "options",
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
    [KEYS.highScore]: {},
    [KEYS.highCombo]: {},
    [KEYS.local]: {
      [KEYS.highScore]: {},
      [KEYS.highCombo]: {},
    },
  },
  log: [],
  matchedIndexes: [],
  [KEYS.moves]: "",
  [KEYS.options]: {
    [KEYS.playerName]: "",
    potato: false,
    seedground: true,
    transitions: true,
    sound: true,
  },
  overlay: true,
  phase: PHASES.initial,
  plusIndex: undefined,
  randomColor: COLORS.white,
  [KEYS.score]: {
    buffer: 0,
    value: 0,
  },
};
