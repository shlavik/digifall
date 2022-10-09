import "./migration";
import App from "./App.svelte";
import { initCore } from "./core.js";
import game from "./stores.js";
import * as sounds from "./sounds.js";
import "./leaderboard.js";

initCore(game, sounds);

var app = new App({
  target: document.body,
});

export default app;
