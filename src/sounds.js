import { Howl } from "howler";

const { random, round } = Math;

const volume = 0.8;
const blinkRateInitial = 0.6;

const SOUNDS = {
  bleep: new Howl({
    src: "/sounds/bleep.mp3",
    volume,
  }),
  blink: new Howl({
    src: "/sounds/blink.mp3",
    rate: blinkRateInitial,
    volume,
  }),
  fadeIn: new Howl({
    src: "/sounds/fadeIn.mp3",
    volume,
  }),
  gameOver: new Howl({
    src: "/sounds/gameOver.mp3",
    volume,
  }),
  generate: new Howl({
    src: "/sounds/generate.mp3",
    volume,
  }),
  kicks: [
    new Howl({
      src: "/sounds/kick1.mp3",
      volume,
    }),
    new Howl({
      src: "/sounds/kick2.mp3",
      volume,
    }),
  ],
  wordUp: new Howl({
    src: "/sounds/wordUp.mp3",
    volume,
  }),
  wow: new Howl({
    src: "/sounds/wow.mp3",
    volume,
  }),
  zoom: new Howl({
    src: "/sounds/zoom.mp3",
    volume,
  }),
};

export function playSoundBleep() {
  SOUNDS.bleep.play();
}

export function playSoundBlink() {
  const play = (rateDiff = 0.02) => {
    SOUNDS.blink.play();
    SOUNDS.blink.rate(SOUNDS.blink.rate() + rateDiff);
  };
  play();
  setTimeout(play, 200);
  setTimeout(() => play(0.04), 400);
}

export function playSoundCardPlus() {
  SOUNDS.zoom.play();
}

export function playSoundFadeIn() {
  SOUNDS.fadeIn.rate(1 - (random() - 0.5) / 10);
  SOUNDS.fadeIn.play();
}

export function playSoundGameOver() {
  SOUNDS.gameOver.play();
}

export function playSoundGenerate() {
  SOUNDS.generate.play();
}

export function playSoundKick() {
  const kick = SOUNDS.kicks[round(random())];
  kick.rate(1 - (random() - 0.5) / 2);
  kick.play();
}

export function playSoundWordUp() {
  SOUNDS.wordUp.play();
}

export function resetSounds() {
  SOUNDS.blink.rate(blinkRateInitial);
}
