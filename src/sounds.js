import { Howl } from "howler";

const { random, round } = Math;

const blinkRateInitial = 0.6;

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

export function playBleep() {
  SOUNDS.bleep.play();
}

export function playBlink() {
  const play = (rateDiff = 0.02) => {
    SOUNDS.blink.rate(SOUNDS.blink.rate() + rateDiff);
    SOUNDS.blink.play();
  };
  play();
  setTimeout(play, 200);
  setTimeout(() => play(0.04), 400);
}

export function playLowEnergy() {
  SOUNDS.lowEnergy.play();
}

export function playPlus() {
  SOUNDS.plus.play();
}

export function playGameOver() {
  SOUNDS.gameOver.play();
}

export function playGenerate() {
  SOUNDS.generate.play();
}

export function playHit(value = 0) {
  SOUNDS.hit.rate(1 - (value ? value : 10) / 36);
  SOUNDS.hit.play();
}

export function playKick() {
  const kick = SOUNDS.kicks[round(random())];
  kick.rate(1 - (random() - 0.5) / 2);
  kick.play();
}

export function playNewRecord() {
  SOUNDS.newRecord.play();
}

export function playSlideIn() {
  SOUNDS.slideIn.play();
}

export function playSlideMove(value = 0) {
  SOUNDS.slideMove.rate(1 + value / 27);
  SOUNDS.slideMove.play();
}

export function playSlideOut() {
  SOUNDS.slideOut.play();
}

export function playTurnOn() {
  SOUNDS.turnOn.rate(1 - (random() - 0.5) / 10);
  SOUNDS.turnOn.play();
}

export function playWordUp() {
  SOUNDS.wordUp.play();
}

export function reset() {
  SOUNDS.blink.rate(blinkRateInitial);
}
