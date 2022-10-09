import { INITIAL_VALUES, KEYS } from "./constants.js";
import { validateRecord } from "./validation.js";

/**
 * For versions < 0.6.0
 */
(function restructIndexedDB() {
  const dBOpenRequest = window.indexedDB.open(KEYS.digifall, 2);
  dBOpenRequest.onupgradeneeded = (event) => {
    const { result: db, transaction } = event.target;
    if (event.oldVersion === 0) return db.createObjectStore(KEYS.leaderboard);
    const digifallStore = transaction.objectStore(KEYS.digifall);
    const leaderboardRequest = digifallStore.get(KEYS.leaderboard);
    leaderboardRequest.onsuccess = (event) => {
      const { highCombo, highScore } = event.target.result;
      const leaderboardStore = db.createObjectStore(KEYS.leaderboard);
      leaderboardStore.put(highCombo, KEYS.highCombo);
      leaderboardStore.put(highScore, KEYS.highScore);
      db.deleteObjectStore(KEYS.digifall);
    };
  };
})();

/**
 * For versions < 0.7.0
 */
(async function wipeOldRecords() {
  const records = localStorage.getItem(KEYS.records);
  if (!records) return;
  const parced = JSON.parse(records);
  try {
    for (const type in parced) {
      if (parced[type].value === 0) continue;
      await validateRecord({ type, ...parced[type] });
    }
  } catch (error) {
    localStorage.setItem(KEYS.records, JSON.stringify(INITIAL_VALUES.records));
  }
})();
