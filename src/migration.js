import { KEYS, STRINGS } from "./constants.js";

(function migrateRecords() {
  const leaderboard = localStorage.getItem(KEYS.leaderboard);
  if (!leaderboard) return;
  const parced = JSON.parse(leaderboard);
  const local = parced[KEYS.local] || {};
  const localHighCombo = local[STRINGS.highCombo] || {};
  const localHighScore = local[STRINGS.highScore] || {};
  const localHighComboKey = Object.keys(localHighCombo)[0];
  const localHighScoreKey = Object.keys(localHighScore)[0];
  if (!localHighComboKey && !localHighScoreKey) return;
  const records = {
    [KEYS.highCombo]: {
      ...localHighCombo[localHighComboKey],
      value: Number(localHighComboKey),
    },
    [KEYS.highScore]: {
      ...localHighScore[localHighScoreKey],
      value: Number(localHighScoreKey),
    },
  };
  localStorage.setItem(KEYS.records, JSON.stringify(records));
  localStorage.removeItem(KEYS.leaderboard);
})();
