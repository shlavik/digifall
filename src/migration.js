import { INITIAL_VALUES, KEYS, PROTOCOL_VERSION } from "./constants.js";

(function removeLocalStorageLeaderboard() {
  const leaderboard = localStorage.getItem(KEYS.leaderboard);
  if (!leaderboard) return;
  localStorage.removeItem(KEYS.leaderboard);
})();

(function clearRecordsWithoutProtocolVersion() {
  const records = localStorage.getItem(KEYS.records);
  if (!records) return;
  const parced = JSON.parse(records);
  if (parced[KEYS.protocolVersion] === PROTOCOL_VERSION) return;
  localStorage.setItem(KEYS.records, JSON.stringify(INITIAL_VALUES.records));
})();

(function enableLeaderboard() {
  const options = localStorage.getItem(KEYS.options);
  if (!options) return;
  const parced = JSON.parse(options);
  if (parced[KEYS.leaderboard] !== undefined) return;
  parced[KEYS.leaderboard] = true;
  localStorage.setItem(KEYS.options, JSON.stringify(parced));
})();
