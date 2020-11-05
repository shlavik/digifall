import { Howl } from "howler";

const { random, round } = Math;

let blinkRateInitial = 0.6,
  blinkRate = blinkRateInitial;

const sounds = {
  bleep: new Howl({
    src: "sounds/bleep.mp3",
  }),
  blink: new Howl({
    src: "sounds/blink.mp3",
    rate: blinkRateInitial,
  }),
  gameover: new Howl({
    src: "sounds/gameover.mp3",
  }),
  kick1: new Howl({
    src: "sounds/kick1.mp3",
  }),
  kick2: new Howl({
    src: "sounds/kick2.mp3",
  }),
};

export function playSoundBleep() {
  sounds.bleep.play();
}

export function playSoundBlink() {
  const play = () => {
    sounds.blink.play();
    sounds.blink.rate((blinkRate += 0.02));
  };
  play();
  setTimeout(play, 200);
  setTimeout(() => {
    sounds.blink.play();
    sounds.blink.rate((blinkRate += 0.06));
  }, 400);
}

export function playSoundGameOver() {
  sounds.gameover.play();
}

export function playSoundKick() {
  const sound = [sounds.kick1, sounds.kick2][round(random())];
  sound.rate(1 - (random() - 0.5) / 2);
  sound.play();
}

export function resetSounds() {
  blinkRate = blinkRateInitial;
  sounds.blink.rate(blinkRateInitial);
}
