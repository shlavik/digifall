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
    src: "/sounds/gameOver.wav",
  }),
  generate: new Howl({
    src: "/sounds/generate.wav",
  }),
  hit: new Howl({
    src: "/sounds/hit.wav",
  }),
  kicks: [
    new Howl({
      src: "/sounds/kick1.wav",
    }),
    new Howl({
      src: "/sounds/kick2.wav",
    }),
  ],
  plus: new Howl({
    src: "/sounds/plus.wav",
  }),
  slideIn: new Howl({
    src: "/sounds/slideIn.wav",
  }),
  slideMove: new Howl({
    src: "/sounds/slideMove.wav",
  }),
  slideOut: new Howl({
    src: "/sounds/slideOut.wav",
  }),
  turnOn: new Howl({
    src: "/sounds/turnOn.wav",
  }),
  wordUp: new Howl({
    src: "/sounds/wordUp.wav",
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
