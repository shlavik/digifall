import { Howl, Howler } from "howler";
import { createEnergySynth } from "./energy-synth.js";
export { getEnergySoundRate } from "./energy-synth.js";

const { random, round } = Math;

/** @typedef {import('howler').Howl} HowlType */

/**
 * Collection of Howler sound objects used by the game.
 * newRecord is optional because the asset may be absent at runtime.
 * @typedef {Object} Sounds
 * @property {HowlType} bleep
 * @property {HowlType} blink
 * @property {HowlType} gameOver
 * @property {HowlType} generate
 * @property {HowlType} hit
 * @property {HowlType[]} kicks
 * @property {HowlType} lowEnergy
 * @property {HowlType} plus
 * @property {HowlType} slideIn
 * @property {HowlType} slideMove
 * @property {HowlType} slideOut
 * @property {HowlType} turnOn
 * @property {HowlType} wordUp
 * @property {HowlType} [newRecord]
 */

/** @type {number} */
const blinkRateInitial = 0.6;

/** @type {Sounds} */
const SOUNDS = {
  bleep: new Howl({
    src: "/sounds/bleep.wav",
  }),
  blink: new Howl({
    src: "/sounds/blink.wav",
    rate: blinkRateInitial,
  }),
  gameOver: new Howl({
    src: "/sounds/game-over.wav",
  }),
  generate: new Howl({
    src: "/sounds/generate.wav",
  }),
  hit: new Howl({
    src: "/sounds/hit.wav",
  }),
  kicks: [
    new Howl({
      src: "/sounds/kick-1.wav",
    }),
    new Howl({
      src: "/sounds/kick-2.wav",
    }),
  ],
  lowEnergy: new Howl({
    src: "/sounds/low-energy.wav",
  }),
  plus: new Howl({
    src: "/sounds/plus.wav",
  }),
  slideIn: new Howl({
    src: "/sounds/slide-in.wav",
  }),
  slideMove: new Howl({
    src: "/sounds/slide-move.wav",
  }),
  slideOut: new Howl({
    src: "/sounds/slide-out.wav",
  }),
  turnOn: new Howl({
    src: "/sounds/turn-on.wav",
  }),
  wordUp: new Howl({
    src: "/sounds/word-up.wav",
  }),
};

/** Plays a short confirmation tone. */
export function playBleep() {
  SOUNDS.bleep.play();
}

/**
 * Plays a sequence of blink sounds with incrementing rate.
 * @returns {void}
 */
export function playBlink() {
  const play = (rateDiff = 0.02) => {
    SOUNDS.blink.rate(SOUNDS.blink.rate() + rateDiff);
    SOUNDS.blink.play();
  };
  play();
  setTimeout(play, 200);
  setTimeout(() => play(0.04), 400);
}

/** Plays low energy alert. */
export function playLowEnergy() {
  SOUNDS.lowEnergy.play();
}

let energySynth;
let energyContext;
let energyRequest = 0;
let visibleEnergy = 100;
const energyVisible = () => typeof document === "undefined" || !document.hidden;

function onEnergyContextState() {
  if (energyContext.state !== "running") stopEnergySounds();
}

function getEnergySynth() {
  const context = Howler.ctx;
  if (!context || context.state !== "running" || !energyVisible()) return null;
  if (energyContext !== context) {
    energySynth?.stop();
    energyContext?.removeEventListener("statechange", onEnergyContextState);
    energyContext = context;
    context.addEventListener("statechange", onEnergyContextState);
    energySynth = createEnergySynth(context, Howler.masterGain);
  }
  return energySynth;
}

/** Silences sources and the shared room; old reverb cannot reappear after unmute. */
export function stopEnergySounds() {
  energyRequest++;
  energySynth?.stop();
}

/** Early completion for reduced-motion and game-over drains. */
export function releaseEnergyChange() {
  energyRequest++;
  energySynth?.releaseAccent();
}

/** Called from the same reactive visible value that positions the white bar. */
export function updateEnergySound(energy) {
  visibleEnergy = energy;
  energySynth?.updateEnergy(energy);
}

/** Actual overflow owns the episode; its pitch still follows the visible reserve. */
export function updateEnergyOverflow({ value }, energy) {
  visibleEnergy = energy;
  if (value > 100) getEnergySynth()?.overflow(true, energy);
  else energySynth?.overflow(false, energy);
}

/** Resume only the current, unexpired animation; never replay a queued old event. */
export function playEnergyChange({ amount }, energy, duration) {
  if (!amount || duration <= 0 || !energyVisible() || !Howler.ctx) return;
  visibleEnergy = energy;
  const request = ++energyRequest;
  const deadline = performance.now() + duration;
  const play = () => {
    const remaining = deadline - performance.now();
    if (request !== energyRequest || remaining <= 0) return;
    getEnergySynth()?.play(
      amount > 0 ? "gain" : "spend",
      visibleEnergy,
      remaining / 1000,
    );
  };
  if (Howler.ctx.state === "running") play();
  else
    Howler.ctx
      .resume()
      .then(play)
      .catch(() => {});
}

/** Plays plus sound. */
export function playPlus() {
  SOUNDS.plus.play();
}

/** Plays game over sound. */
export function playGameOver() {
  SOUNDS.gameOver.play();
}

/** Plays generation sound. */
export function playGenerate() {
  SOUNDS.generate.play();
}

/**
 * Plays hit sound with pitch depending on value.
 * @param {number} [value=0]
 */
export function playHit(value = 0) {
  SOUNDS.hit.rate(1 - (value ? value : 10) / 36);
  SOUNDS.hit.play();
}

/** Plays one of the kick sounds with slight rate randomization. */
export function playKick() {
  const kick = SOUNDS.kicks[round(random())];
  kick.rate(1 - (random() - 0.5) / 2);
  kick.play();
}

/** Plays new record sound if present. */
export function playNewRecord() {
  SOUNDS.newRecord.play();
}

/** Plays slide-in sound. */
export function playSlideIn() {
  SOUNDS.slideIn.play();
}

/**
 * Plays slide-move sound adjusting rate based on value.
 * @param {number} [value=0]
 */
export function playSlideMove(value = 0) {
  SOUNDS.slideMove.rate(1 + value / 27);
  SOUNDS.slideMove.play();
}

/** Plays slide-out sound. */
export function playSlideOut() {
  SOUNDS.slideOut.play();
}

/** Plays device turn-on sound with slight randomization. */
export function playTurnOn() {
  SOUNDS.turnOn.rate(1 - (random() - 0.5) / 10);
  SOUNDS.turnOn.play();
}

/** Plays word-up/combo sound. */
export function playWordUp() {
  SOUNDS.wordUp.play();
}

/** Resets runtime parameters for sounds (e.g., blink rate). */
export function reset() {
  SOUNDS.blink.rate(blinkRateInitial);
}
