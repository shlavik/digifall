import { Howl } from "howler";

const { random, trunc } = Math;

let blinkRateInitial = 0.6,
  blinkRate = blinkRateInitial;

const SOUNDS = {
  bleep: new Howl({
    src: "sounds/bleep.mp3",
  }),
  blink: new Howl({
    src: "sounds/blink.mp3",
    rate: blinkRateInitial,
  }),
  fadeIn: new Howl({
    src: "sounds/fadeIn.mp3",
  }),
  gameover: new Howl({
    src: "sounds/gameover.mp3",
  }),
  generate: new Howl({
    src: "sounds/generate.mp3",
  }),
  kicks: [
    new Howl({
      src: "sounds/kick1.mp3",
    }),
    new Howl({
      src: "sounds/kick2.mp3",
    }),
  ],
};

export function playSoundBleep() {
  SOUNDS.bleep.play();
}

export function playSoundBlink() {
  const play = () => {
    SOUNDS.blink.play();
    SOUNDS.blink.rate((blinkRate += 0.02));
  };
  play();
  setTimeout(play, 200);
  setTimeout(() => {
    SOUNDS.blink.play();
    SOUNDS.blink.rate((blinkRate += 0.04));
  }, 400);
}

export function playSoundFadeIn() {
  SOUNDS.fadeIn.rate(1 - (random() - 0.5) / 10);
  SOUNDS.fadeIn.play();
}

export function playSoundGameOver() {
  SOUNDS.gameover.play();
}

export function playSoundGenerate() {
  SOUNDS.generate.play();
}

export function playSoundKick() {
  const kick = SOUNDS.kicks[trunc(random())];
  kick.rate(1 - (random() - 0.5) / 2);
  kick.play();
}

export function resetSounds() {
  blinkRate = blinkRateInitial;
  SOUNDS.blink.rate(blinkRateInitial);
}
