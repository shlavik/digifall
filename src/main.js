import App from "./App.svelte";
import { initCore } from "./core.js";
import game from "./stores.js";
import "./leaderboard.js";

initCore(game);

var app = new App({
  target: document.body,
});

export default app;
