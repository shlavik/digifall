export const COLOR_WHITE = "white";

export const KEY_HIGH_SCORE = "hi-score";
export const KEY_HIGH_TOTAL = "hi-total";
export const KEY_LEADERBOARD = "leaderboard";
export const KEY_LOCAL = "local";
export const KEY_MOVES = "moves";
export const KEY_OPTIONS = "options";
export const KEY_SCORE = "score";
export const KEY_TIMESTAMP = "timestamp";
export const KEY_TOUCH = "touch";

export const MENU_MAIN = "main";
export const MENU_NAME = "name";
export const MENU_NEW_GAME = "new game";
export const MENU_OPTIONS = "options";

export const PHASE_BLINK = "blink";
export const PHASE_EXTRA = "extra";
export const PHASE_FALL = "fall";
export const PHASE_GAMEOVER = "gameover";
export const PHASE_IDLE = "idle";
export const PHASE_INITIAL = "initial";
export const PHASE_MATCH = "match";
export const PHASE_PLUS = "plus";
export const PHASE_SCORE = "score";
export const PHASE_TOTAL = "total";

export const PROP_SHADOW_0 = "--shadow-0";
export const PROP_SHADOW_1 = "--shadow-1";
export const PROP_SHADOW_2 = "--shadow-2";
export const PROP_SHADOW_3 = "--shadow-3";
export const PROP_SHADOW_INSET_1 = "--shadow-inset-1";
export const PROP_SHADOW_INSET_2 = "--shadow-inset-2";

export const STYLE_NONE = "none";
export const STYLE_TRANSPARENT = "0 0 0 transparent";
export const STYLE_SHADOW_0 = "0 0 1px black";
export const STYLE_SHADOW_1 =
  "0 0.5rem 0.5rem var(--color-black-04), 0 -1px 0 white";
export const STYLE_SHADOW_2 =
  "0 1rem 1rem var(--color-black-04), 0 -1px 0 white";
export const STYLE_SHADOW_3 = "0 0 3rem 2rem var(--color-black-04)";
export const STYLE_SHADOW_INSET_1 =
  "inset 0 0.5rem 0.5rem var(--color-black-04), 0 1px 0 white";
export const STYLE_SHADOW_INSET_2 =
  "inset 0 1rem 1rem var(--color-black-04), 0 1px 0 white";

export const TYPE_NUMBER = "number";
export const TYPE_STRING = "string";

export const EMPTY_ARRAY = [];
export const EMPTY_STRING = "";

export const INITIAL_CARDS = EMPTY_ARRAY;
export const INITIAL_ENERGY = { buffer: 0, value: 100 };
export const INITIAL_LEADERBOARD = {
  [KEY_HIGH_SCORE]: {},
  [KEY_HIGH_TOTAL]: {},
  [KEY_LOCAL]: {
    [KEY_HIGH_SCORE]: {},
    [KEY_HIGH_TOTAL]: {},
  },
};
export const INITIAL_LOG = EMPTY_ARRAY;
export const INITIAL_MATCHED_INDEXES = EMPTY_ARRAY;
export const INITIAL_MOVES = EMPTY_STRING;
export const INITIAL_OPTIONS = {
  playerName: EMPTY_STRING,
  seedground: true,
  shadows: true,
  sound: false,
  transitions: true,
};
export const INITIAL_OVERLAY = true;
export const INITIAL_PHASE = PHASE_INITIAL;
export const INITIAL_PLUS_INDEX = undefined;
export const INITIAL_RANDOM_COLOR = COLOR_WHITE;
export const INITIAL_SCORE = { buffer: 0, value: 0 };
