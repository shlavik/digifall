import assert from "node:assert/strict";
import test from "node:test";
import { Howler } from "howler";
import { createEnergySynth, getEnergySoundRate } from "../src/energy-synth.js";
import {
  playEnergyChange,
  stopEnergySounds,
  updateEnergySound,
} from "../src/sounds.js";

function audioContext() {
  const nodes = [];
  const listeners = new Set();
  const param = (value = 0) => ({
    value,
    events: [],
    setValueAtTime(value, time) {
      this.events.push(["set", value, time]);
    },
    linearRampToValueAtTime(value, time) {
      this.events.push(["linear", value, time]);
    },
    exponentialRampToValueAtTime(value, time) {
      this.events.push(["exponential", value, time]);
    },
    setTargetAtTime(value, time, constant) {
      this.events.push(["target", value, time, constant]);
    },
    cancelScheduledValues(time) {
      this.events.push(["cancel", time]);
    },
    cancelAndHoldAtTime(time) {
      this.events.push(["hold", time]);
    },
  });
  const node = (kind) => {
    const result = {
      kind,
      gain: param(),
      frequency: param(),
      delayTime: param(),
      Q: param(),
      edges: new Set(),
      stopTime: Infinity,
      started: false,
      ended: false,
      connect(other) {
        this.edges.add(other);
        return other;
      },
      disconnect() {
        this.edges.clear();
      },
      start(time) {
        this.started = true;
        this.startTime = time;
      },
      stop(time = context.currentTime) {
        this.stopTime = time;
      },
    };
    nodes.push(result);
    return result;
  };
  const context = {
    currentTime: 0,
    sampleRate: 44100,
    state: "running",
    nodes,
    createBuffer(channels, frames) {
      const data = Array.from(
        { length: channels },
        () => new Float32Array(frames),
      );
      return { getChannelData: (i) => data[i] };
    },
    createGain: () => node("gain"),
    createBiquadFilter: () => node("filter"),
    createWaveShaper: () => node("drive"),
    createConvolver: () => node("room"),
    createDelay: () => node("delay"),
    createOscillator: () => node("oscillator"),
    createBufferSource: () => node("noise"),
    addEventListener(event, callback) {
      listeners.add(callback);
    },
    removeEventListener(event, callback) {
      listeners.delete(callback);
    },
    setState(state) {
      this.state = state;
      for (const callback of listeners) callback();
    },
    advance(time) {
      this.currentTime = time;
      for (const source of nodes)
        if (source.started && !source.ended && source.stopTime <= time) {
          source.ended = true;
          source.onended?.();
        }
    },
  };
  context.destination = node("destination");
  context.tones = () => nodes.filter((n) => n.kind === "oscillator");
  context.active = () =>
    nodes.filter(
      (n) => n.started && !n.ended && n.stopTime > context.currentTime,
    );
  return context;
}

function fixture(t) {
  const context = audioContext();
  const synth = createEnergySynth(context, context.destination);
  t.after(() => synth.stop());
  return { context, synth };
}

test("visible reserve sets a continuous monotonic pitch, including empty and overflow", () => {
  assert.equal(getEnergySoundRate(0), 0.5);
  assert.equal(getEnergySoundRate(100), 1);
  assert.equal(getEnergySoundRate(200), 2);
  assert.equal(getEnergySoundRate(-10), 0.5);
  assert.equal(getEnergySoundRate(300), 2);
  assert.ok(getEnergySoundRate(50.5) > getEnergySoundRate(50));
});

test("tone sustains until its visual deadline and updates only from the supplied visible value", (t) => {
  const { context, synth } = fixture(t);
  synth.play("gain", 80, 0.9);
  const root = context.tones()[0];
  assert.equal(root.frequency.value, 440 * getEnergySoundRate(80));
  context.advance(0.29);
  synth.updateEnergy(80);
  assert.equal(
    root.frequency.events.length,
    0,
    "gain delay holds the initial pitch",
  );
  context.advance(0.4);
  synth.updateEnergy(90);
  assert.equal(root.frequency.events.at(-1)[1], 440 * getEnergySoundRate(90));
  context.advance(0.72);
  synth.updateEnergy(100);
  assert.equal(root.frequency.events.at(-1)[1], 440);
  assert.equal(root.stopTime, 1.06);
  assert.ok(context.active().includes(root));
  context.advance(0.91);
  const events = root.frequency.events.length;
  synth.updateEnergy(150);
  assert.equal(root.frequency.events.length, events, "release does not retune");
  context.advance(1.07);
  assert.equal(context.active().length, 0);
  assert.equal(root.edges.size, 0);
});

test("replacement crossfades one retiring accent without retuning its tail", (t) => {
  const { context, synth } = fixture(t);
  synth.play("gain", 80, 0.9);
  const old = context.tones()[0];
  context.advance(0.1);
  synth.play("spend", 100, 0.48);
  synth.updateEnergy(90);
  assert.equal(old.frequency.events.length, 0);
  assert.equal(old.stopTime, 0.26);
  for (let i = 0; i < 30; i++) {
    context.advance(0.11 + i * 0.01);
    synth.play(i % 2 ? "gain" : "spend", 100 - i, 0.9);
    assert.ok(context.active().length <= 8, "at most two four-source accents");
  }
});

test("bonus retains a major triad, follows visible energy and does not restart on ticks", (t) => {
  const { context, synth } = fixture(t);
  synth.overflow(true, 100);
  assert.equal(context.tones().length, 9);
  const roots = context.tones().filter((_, i) => i % 3 === 0);
  for (const [i, semitone] of [0, 4, 7].entries())
    assert.equal(roots[i].frequency.value, 220 * 2 ** (semitone / 12));
  context.advance(0.5);
  synth.overflow(true, 120);
  synth.updateEnergy(120);
  assert.equal(context.tones().length, 9);
  assert.equal(
    roots[0].frequency.events.at(-1)[1],
    220 * getEnergySoundRate(120),
  );
});

test("rapid bonus hold and re-entry remain bounded; mute cancels pending releases and the room", (t) => {
  const { context, synth } = fixture(t);
  t.mock.timers.enable({ apis: ["setTimeout"] });
  synth.overflow(true, 95);
  synth.overflow(false, 100);
  t.mock.timers.tick(449);
  assert.equal(context.tones()[0].stopTime, Infinity);
  context.advance(0.45);
  t.mock.timers.tick(1);
  assert.equal(context.tones()[0].stopTime, 0.61);
  for (let i = 0; i < 20; i++) {
    synth.overflow(true, 105);
    synth.overflow(false, 100);
    synth.play("gain", 100, 0.9);
    assert.ok(
      context.active().length <= 32,
      "two accents and two crossfading chords",
    );
  }
  synth.stop();
  assert.equal(context.active().length, 0);
  assert.ok(context.nodes.every((n) => n.edges.size === 0));
  t.mock.timers.tick(3000);
  synth.play("gain", 80, 0.9);
  assert.equal(
    context.nodes.filter((n) => n.kind === "room" && n.edges.size).length,
    1,
    "restart uses a fresh room, not old tails",
  );
});

function adapter(t, context) {
  const previous = { context: Howler.ctx, master: Howler.masterGain };
  Howler.ctx = context;
  Howler.masterGain = context.destination;
  t.after(() => {
    stopEnergySounds();
    Howler.ctx = previous.context;
    Howler.masterGain = previous.master;
  });
}

test("adapter resumes only the current unexpired event at its latest visible pitch", async (t) => {
  const context = audioContext();
  context.state = "suspended";
  let resume;
  context.resume = () =>
    new Promise((resolve) => {
      resume = resolve;
    });
  adapter(t, context);
  playEnergyChange({ amount: 20 }, 80, 900);
  assert.equal(context.tones().length, 0);
  updateEnergySound(90);
  context.state = "running";
  resume();
  await Promise.resolve();
  assert.equal(
    context.tones()[0].frequency.value,
    440 * getEnergySoundRate(90),
  );
  context.setState("suspended");
  assert.equal(context.active().length, 0);
});

test("mute/reset and expired gestures cannot produce delayed playback", async (t) => {
  const context = audioContext();
  context.state = "suspended";
  let resume;
  let now = 0;
  t.mock.method(performance, "now", () => now);
  context.resume = () =>
    new Promise((resolve) => {
      resume = resolve;
    });
  adapter(t, context);
  playEnergyChange({ amount: 20 }, 80, 900);
  stopEnergySounds();
  context.state = "running";
  resume();
  await Promise.resolve();
  assert.equal(context.tones().length, 0);
  context.state = "suspended";
  playEnergyChange({ amount: 20 }, 80, 900);
  now = 1000;
  context.state = "running";
  resume();
  await Promise.resolve();
  assert.equal(context.tones().length, 0);
});
