import App from "./App.svelte";
import { initCore } from "./core.js";

initCore();

var app = new App({
  target: document.body,
});

export default app;
