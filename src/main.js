import App from "./App.svelte";
import { initCore } from "./core.js";

var app = new App({
  target: document.body,
});

initCore();

export default app;
