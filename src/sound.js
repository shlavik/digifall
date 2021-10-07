import { Howl } from "howler";

const { random, round } = Math;

playSoundBlink.rateInitial = 0.6;
playSoundBlink.rate = playSoundBlink.rateInitial;

const SOUNDS = {
  bleep: new Howl({
    src: "sounds/bleep.mp3",
  }),
  blink: new Howl({
    src: "sounds/blink.mp3",
    rate: playSoundBlink.rate,
  }),
  fadeIn: new Howl({
    src: "sounds/fadeIn.mp3",
  }),
  gameOver: new Howl({
    src: "sounds/gameOver.mp3",
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
  wordUp: new Howl({
    src: "sounds/wordUp.mp3",
  }),
  wow: new Howl({
    src: "sounds/wow.mp3",
  }),
  zoom: new Howl({
    src: "sounds/zoom.mp3",
  }),
};

export function playSoundBleep() {
  SOUNDS.bleep.play();
}

export function playSoundBlink() {
  const play = (rateDiff = 0.02) => {
    SOUNDS.blink.play();
    SOUNDS.blink.rate((playSoundBlink.rate += rateDiff));
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
  playSoundBlink.rate = playSoundBlink.rateInitial;
}
