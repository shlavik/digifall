import { KEYS } from "./constants.js";

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
