import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../dist/energy-check/", import.meta.url);
await mkdir(output, { recursive: true });
const server = await createServer({
  root,
  server: { host: "127.0.0.1", port: 0 },
});
let browser;
const errors = [];
try {
  await server.listen();
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem(
      "options",
      JSON.stringify({
        playerName: "polish",
        leaderboard: false,
        rapid: false,
        sound: true,
        cluster: true,
      }),
    );
    localStorage.setItem("timestamp", "1700000000000");
    window.tones = [];
    // Observe real native sources; legacy Howler samples do not use oscillators.
    const create = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (...args) {
      const source = create.apply(this, args);
      const record = { source, initial: 0, stop: Infinity, ended: false };
      const start = source.start.bind(source);
      const stop = source.stop.bind(source);
      source.start = (...args) => {
        record.initial = source.frequency.value;
        window.tones.push(record);
        return start(...args);
      };
      source.stop = (time = source.context.currentTime) => {
        record.stop = time;
        return stop(time);
      };
      source.addEventListener("ended", () => {
        record.ended = true;
      });
      return source;
    };
    window.activeTones = () =>
      window.tones.filter(
        (t) => !t.ended && t.stop > t.source.context.currentTime,
      );
  });
  await page.goto(server.resolvedUrls.local[0]);
  await page.getByRole("button", { name: "resume", exact: true }).click();
  await page.waitForFunction(async () => {
    window.stores = await import("/src/stores.js");
    return (
      stores.default.ready &&
      stores.phaseStore.get() === "idle" &&
      window.Howler.ctx.state === "running"
    );
  });
  await page.evaluate(() => {
    window.originalCards = stores.cardsStore.get();
  });
  const screenshot = (name) =>
    page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)) });
  const settled = () =>
    page.waitForFunction(
      () =>
        stores.phaseStore.get() === "idle" &&
        stores.plusIndexStore.get() === null &&
        stores.energyStore.get().buffer === 0,
    );
  const active = () => page.evaluate(() => activeTones().length);
  const silence = () => page.waitForFunction(() => activeTones().length === 0);
  const baseline = (value, options = {}) =>
    page.evaluate(
      ({ value, options }) => {
        stores.default.ready = false;
        stores.energyStore.set({ value, buffer: 0 });
        stores.optionsStore.update((v) => ({ ...v, ...options }));
        stores.default.ready = true;
        window.tones = [];
      },
      { value, options },
    );
  const visible = () =>
    page.locator(".game .energy").evaluate((el) => {
      const fraction =
        el.querySelector(".left-bar").getBoundingClientRect().width /
        el.getBoundingClientRect().width;
      return el.querySelector(".right-bar").classList.contains("extra")
        ? 200 - fraction * 100
        : fraction * 100;
    });

  // Real input, including audio wake after an idle/suspended context.
  await page.evaluate(() => Howler.ctx.suspend());
  await page.locator(".game .card").first().hover();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => tones.length === 3);
  await screenshot("spend");
  await settled();
  assert.equal(await page.evaluate(() => tones.length), 3);
  await silence();

  // All ten digit-color transitions, including 9 → 0, still use the actual core.
  for (const rapid of [false, true])
    for (let digit = 0; digit < 10; digit++) {
      await baseline(100, { rapid });
      await page.evaluate((digit) => {
        stores.cardsStore.set(
          Array.from({ length: 36 }, (_, index) => ({
            x: Math.trunc(index / 6),
            y: index % 6,
            value: index === 0 ? (digit + 9) % 10 : digit,
            duration: 0,
          })),
        );
        stores.plusIndexStore.set(0);
      }, digit);
      await page.waitForSelector(".game .spend-ghost");
      const colors = await page
        .locator(".game .spend-ghost")
        .evaluate((el, digit) => {
          const color = (value) => {
            const sample = document.createElement("span");
            sample.style.color = `var(--color-${value})`;
            document.body.append(sample);
            const result = getComputedStyle(sample).color;
            sample.remove();
            return result;
          };
          const animation = el.getAnimations()[0],
            time = animation.currentTime;
          animation.pause();
          animation.currentTime = 0;
          const from = getComputedStyle(el).backgroundColor;
          animation.currentTime = 312;
          const to = getComputedStyle(el).backgroundColor;
          animation.currentTime = time;
          animation.play();
          return {
            from,
            to,
            expectedFrom: color((digit + 9) % 10),
            expectedTo: color(digit),
          };
        }, digit);
      assert.equal(colors.from, colors.expectedFrom);
      assert.equal(colors.to, colors.expectedTo);
      await settled();
      assert.equal(
        await page.evaluate(() => tones.length),
        3,
        "one primary energy voice per transaction",
      );
    }

  // Measured DOM and real AudioParam values prove that both hold, then move together.
  await baseline(40, { rapid: false });
  await page.evaluate(() => {
    stores.cardsStore.set(originalCards);
    window.gainFrames = [];
    window.gainDone = false;
    stores.energyStore.set({ value: 40, buffer: 25 });
    const started = performance.now();
    const sample = (now) => {
      const root = document
        .querySelector(".game .energy")
        .getBoundingClientRect();
      const bar = document
        .querySelector(".game .left-bar")
        .getBoundingClientRect();
      const glow = document.querySelector(".game .gain-ghost");
      const wave = document.querySelector(".game .energy-down-wave");
      if (glow && wave && tones[0])
        gainFrames.push({
          time: now - started,
          fill: (bar.width / root.width) * 100,
          glowRight:
            ((glow.getBoundingClientRect().right - root.left) / root.width) *
            100,
          waveTop: (wave.getBoundingClientRect().top - root.top) / root.height,
          actual: stores.energyStore.get().value,
          rainbowX: new DOMMatrixReadOnly(
            getComputedStyle(glow.querySelector(".energy-spectrum")).transform,
          ).m41,
          pitch: tones[0].source.frequency.value,
          playing: activeTones().length,
        });
      if (now - started < 780) requestAnimationFrame(sample);
      else window.gainDone = true;
    };
    requestAnimationFrame(sample);
  });
  await page.waitForFunction(() => stores.energyStore.get().buffer === 0);
  await screenshot("gain");
  await page.waitForFunction(() => gainDone);
  const frames = await page.evaluate(() => gainFrames);
  const hold = frames.filter((f) => f.time > 130 && f.time < 270);
  assert.ok(hold.length >= 2);
  assert.ok(hold.every((f) => Math.abs(f.fill - 40) < 0.01));
  assert.ok(hold.every((f) => Math.abs(f.pitch - 440 * 2 ** -0.6) < 0.5));
  assert.ok(
    hold.some((f) => f.actual > 45),
    "real energy is not delayed",
  );
  assert.ok(new Set(hold.map((f) => f.rainbowX.toFixed(1))).size > 1);
  assert.ok(frames.some((f) => f.time < 120 && f.glowRight > f.fill + 5));
  assert.ok(frames.some((f) => f.time > 300 && f.fill > 40 && f.fill < 64));
  assert.ok(
    frames.some((f) => f.waveTop < 0) && frames.some((f) => f.waveTop > 0.7),
  );
  assert.ok(
    frames.every((f) => f.playing === 3),
    "sustain outlives the fill and lasts through the effect",
  );
  assert.ok(Math.abs(frames.at(-1).fill - 65) < 0.2);
  assert.ok(Math.abs(frames.at(-1).pitch - 440 * 2 ** -0.35) < 1);
  await silence();

  // Recovery wave and delayed-animation cancellation.
  await baseline(12);
  await page.evaluate(() => stores.energyStore.set({ value: 12, buffer: 26 }));
  await page.waitForSelector(".game .energy-recovery");
  assert.deepEqual(
    await page
      .locator(".game .energy-recovery")
      .evaluate((el) => ({ left: el.style.left, width: el.style.width })),
    { left: "38%", width: "62%" },
  );
  await page.waitForSelector(".energy-feedback", { state: "detached" });
  await baseline(10, { rapid: true });
  await page.evaluate(() => {
    stores.energyStore.set({ value: 10, buffer: 25 });
    stores.default.ready = false;
    stores.energyStore.set({ value: 100, buffer: 0 });
    stores.default.ready = true;
  });
  await page.waitForTimeout(400);
  assert.equal(await active(), 0);
  assert.equal(await visible(), 100);
  assert.equal(await page.locator(".energy-feedback").count(), 0);

  // Overflow chord follows the same visible pitch, stays major, and releases after conversion.
  await baseline(95, { rapid: false });
  await page.evaluate(() => stores.energyStore.set({ value: 95, buffer: 25 }));
  await page.waitForSelector(".game .energy-overflow-feedback");
  assert.deepEqual(
    await page
      .locator(".game .energy-overflow-feedback .gain-ghost")
      .evaluate((el) => ({ right: el.style.right, width: el.style.width })),
    { right: "0%", width: "20%" },
  );
  await screenshot("gain-overflow");
  await page.waitForSelector(".energy-feedback", { state: "detached" });
  assert.equal(await page.evaluate(() => tones.length), 12);
  const roots = await page.evaluate(() =>
    [3, 6, 9].map((i) => tones[i].source.frequency.value),
  );
  for (const [i, semitone] of [0, 4, 7].entries())
    assert.ok(Math.abs(roots[i] - 220 * 2 ** 0.2 * 2 ** (semitone / 12)) < 1);
  const count = await page.evaluate(() => tones.length);
  await page.evaluate(() => stores.phaseStore.set("extra"));
  await settled();
  await silence();
  assert.equal(
    await page.evaluate(() => tones.length),
    count,
    "conversion does not play a spend",
  );

  // Original folded layout and split-color numerals, particularly 101–110.
  for (const value of [
    0, 1, 7, 15, 90, 100, 101, 105, 110, 119, 120, 150, 199, 200,
  ]) {
    await baseline(value, { sound: false });
    await screenshot(`value-${value}`);
    assert.ok(Math.abs((await visible()) - value) < 0.02);
    if (value > 100 && value <= 110) {
      const ink = await page.locator(".game .left-value").evaluate((el) => {
        const text = el.getBoundingClientRect(),
          white = el.parentElement.getBoundingClientRect(),
          style = getComputedStyle(el);
        return {
          text: el.textContent,
          width: Math.min(text.right, white.right) - text.left,
          display: style.display,
          opacity: style.opacity,
          color: style.color,
          other: getComputedStyle(el.closest(".energy").querySelector(".front"))
            .color,
        };
      });
      assert.equal(ink.text, String(value));
      assert.ok(ink.width > 0);
      assert.notEqual(ink.display, "none");
      assert.equal(ink.opacity, "1");
      assert.notEqual(ink.color, ink.other);
    }
  }

  // Mute interrupts native sources and prevents replay on unmute.
  await baseline(40, { sound: true, rapid: true });
  await page.evaluate(() => stores.energyStore.set({ value: 40, buffer: 25 }));
  assert.equal(await active(), 3);
  await page.evaluate(() =>
    stores.optionsStore.update((v) => ({ ...v, sound: false })),
  );
  assert.equal(await active(), 0);
  const mutedCount = await page.evaluate(() => tones.length);
  await page.evaluate(() =>
    stores.optionsStore.update((v) => ({ ...v, sound: true })),
  );
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => tones.length), mutedCount);

  // Turning reduced motion on releases an active voice; subsequent instant updates are brief.
  await baseline(40);
  await page.evaluate(() => stores.energyStore.set({ value: 40, buffer: 25 }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(250);
  assert.equal(await active(), 0);
  assert.ok(Math.abs((await visible()) - 65) < 0.02);
  await baseline(12);
  await page.evaluate(() => stores.energyStore.set({ value: 12, buffer: 26 }));
  assert.ok(Math.abs((await visible()) - 38) < 0.02);
  assert.equal(
    await page
      .locator(".game .energy-feedback")
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
  const reducedPitch = await page.evaluate(() => tones[0].initial);
  assert.ok(
    Math.abs(reducedPitch - 440 * 2 ** -0.62) < 1,
    `Reduced-motion onset pitch: ${reducedPitch}`,
  );
  await silence();
  await baseline(40, { rapid: false });
  await page.evaluate(() => stores.energyStore.set({ value: 40, buffer: 25 }));
  await page.waitForTimeout(100);
  assert.equal(
    await active(),
    3,
    "reduced-motion buffered changes sustain through the real drain",
  );
  const reducedDifference = await page
    .locator(".game .energy")
    .evaluate(
      (el) =>
        (el.querySelector(".left-bar").getBoundingClientRect().width /
          el.getBoundingClientRect().width) *
          100 -
        stores.energyStore.get().value,
    );
  assert.ok(Math.abs(reducedDifference) < 0.02);
  await page.waitForFunction(() => stores.energyStore.get().buffer === 0);
  await page.waitForTimeout(200);
  assert.equal(
    await active(),
    0,
    "drain completion releases without the decorative deadline",
  );
  await screenshot("reduced-motion");
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await screenshot(`layout-${viewport.width}`);
    const bounds = await page.locator(".game .energy").boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= viewport.width);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });

  // Rapid overflow survives a synchronous conversion; native sources stay bounded under replacement.
  await baseline(95, { rapid: true });
  await page.evaluate(() => {
    stores.energyStore.set({ value: 95, buffer: 25 });
    stores.phaseStore.set("extra");
  });
  assert.equal(await page.evaluate(() => stores.energyStore.get().value), 100);
  assert.ok((await active()) >= 9);
  await silence();
  await baseline(50);
  const maximum = await page.evaluate(() => {
    let max = 0;
    for (let i = 0; i < 30; i++) {
      stores.energyStore.set({ value: i % 2 ? 50 : 60, buffer: 0 });
      max = Math.max(max, activeTones().length);
    }
    return max;
  });
  assert.ok(maximum <= 6, "one current accent and one retiring accent");

  // A hidden page stops energy audio even if game-state callbacks continue.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    stores.energyStore.set({ value: 70, buffer: 0 });
  });
  assert.equal(await active(), 0);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });

  // Final drain exceeds the spend trail: sustain follows the moving white bar to zero.
  await baseline(7, { rapid: false });
  await page.evaluate(() => stores.phaseStore.set("gameOver"));
  await page.waitForSelector(".game-over .energy-feedback");
  assert.equal(await page.locator(".energy-feedback").count(), 2);
  assert.equal(
    await page.evaluate(() => tones.length),
    3,
    "duplicate game-over surface is inaudible",
  );
  await page.waitForTimeout(700);
  assert.equal(
    await active(),
    3,
    "final drain is not cut off at the 480ms trail deadline",
  );
  await page.waitForFunction(() => stores.energyStore.get().value === 0);
  await silence();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".game-over .energy-out span")].every(
      (el) => Number(getComputedStyle(el).opacity) === 1,
    ),
  );
  assert.equal(await page.locator(".game-over .right-value.flip").count(), 1);
  await screenshot("game-over");
  await page.evaluate(() => {
    window.tones = [];
    stores.resetGame();
  });
  await page.waitForFunction(
    () => stores.default.ready && stores.phaseStore.get() === "idle",
  );
  assert.equal(await page.evaluate(() => tones.length), 0);

  // Persisted replay remains silent from document creation, including native oscillators.
  const restored = await browser.newPage();
  restored.on("pageerror", (error) => errors.push(error.message));
  await restored.addInitScript(() => {
    localStorage.setItem(
      "options",
      JSON.stringify({
        playerName: "polish",
        leaderboard: false,
        rapid: false,
        sound: true,
        cluster: true,
      }),
    );
    localStorage.setItem("timestamp", "1700000000000");
    localStorage.setItem("moves", JSON.stringify("AA=="));
    window.startupSounds = 0;
    for (const prototype of [
      AudioBufferSourceNode.prototype,
      OscillatorNode.prototype,
    ]) {
      const start = prototype.start;
      prototype.start = function (...args) {
        if (!this.buffer || this.buffer.duration > 0.05) window.startupSounds++;
        return start.apply(this, args);
      };
    }
  });
  await restored.goto(server.resolvedUrls.local[0]);
  await restored.waitForFunction(async () => {
    const s = await import("/src/stores.js");
    return (
      s.default.ready &&
      s.default.movesInitial === null &&
      s.phaseStore.get() === "idle"
    );
  });
  assert.equal(await restored.evaluate(() => startupSounds), 0);
  assert.deepEqual(errors, []);
  console.log(
    "Energy visual/native-audio checks passed. Screenshots: dist/energy-check/ (controlled states).",
  );
} finally {
  await browser?.close();
  await server.close();
}
