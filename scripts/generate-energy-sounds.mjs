import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

// Audition the production instrument without generating or replacing game assets.
const source = readFileSync(
  new URL("../src/energy-synth.js", import.meta.url),
  "utf8",
);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const output = new URL("../dist/energy-sounds/", import.meta.url);
mkdirSync(output, { recursive: true });
const kinds =
  process.argv.length > 2
    ? process.argv.slice(2)
    : ["charge", "spend", "overflow"];
assert.ok(
  kinds.every((kind) => ["charge", "spend", "overflow"].includes(kind)),
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  headless: true,
});
try {
  const page = await browser.newPage();
  for (const kind of kinds) {
    const channels = await page.evaluate(
      async ({ kind, moduleUrl }) => {
        const { createEnergySynth } = await import(moduleUrl);
        const duration =
          kind === "overflow" ? 1.5 : kind === "charge" ? 0.9 : 0.48;
        const context = new OfflineAudioContext(
          2,
          Math.ceil((duration + 1.2) * 44100),
          44100,
        );
        const synth = createEnergySynth(context, context.destination);
        synth.play(
          kind === "charge" ? "gain" : kind === "overflow" ? "bonus" : "spend",
          kind === "charge" ? 80 : kind === "spend" ? 100 : 120,
          duration,
        );
        for (let time = 0.016; time < duration; time += 0.016) {
          context.suspend(time).then(() => {
            const now = context.currentTime;
            let energy = 120;
            if (kind === "charge")
              energy =
                80 +
                20 *
                  (1 - (1 - Math.max(0, Math.min(1, (now - 0.3) / 0.42))) ** 3);
            if (kind === "spend") energy = 100 - 10 * Math.min(1, now / 0.224);
            synth.updateEnergy(energy);
            context.resume();
          });
        }
        const rendered = await context.startRendering();
        const result = [
          Array.from(rendered.getChannelData(0)),
          Array.from(rendered.getChannelData(1)),
        ];
        synth.stop();
        return result;
      },
      { kind, moduleUrl },
    );
    const frames = channels[0].length;
    const wav = Buffer.alloc(44 + frames * 4);
    wav.write("RIFF", 0);
    wav.writeUInt32LE(wav.length - 8, 4);
    wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(2, 22);
    wav.writeUInt32LE(44100, 24);
    wav.writeUInt32LE(176400, 28);
    wav.writeUInt16LE(4, 32);
    wav.writeUInt16LE(16, 34);
    wav.write("data", 36);
    wav.writeUInt32LE(frames * 4, 40);
    let peak = 0;
    for (let frame = 0; frame < frames; frame++)
      for (let channel = 0; channel < 2; channel++) {
        const sample = channels[channel][frame];
        assert.ok(
          Number.isFinite(sample) && Math.abs(sample) < 1,
          "finite, unclipped waveform",
        );
        peak = Math.max(peak, Math.abs(sample));
        wav.writeInt16LE(
          Math.round(sample * 32767),
          44 + frame * 4 + channel * 2,
        );
      }
    const rms = (from, to) => {
      const first = Math.floor(from * 44100),
        last = Math.floor(to * 44100);
      let sum = 0;
      for (let i = first; i < last; i++) sum += channels[0][i] ** 2;
      return Math.sqrt(sum / (last - first));
    };
    const duration = kind === "overflow" ? 1.5 : kind === "charge" ? 0.9 : 0.48;
    const early = rms(0.08, 0.18),
      late = rms(duration - 0.12, duration - 0.02);
    assert.ok(late > early * 0.6, "sustain lasts to the end of the effect");
    assert.ok(
      rms(duration + 0.4, duration + 0.55) < late * 0.1,
      "release and restrained room decay",
    );
    assert.ok(peak > 0.01);
    assert.equal(wav.readInt32LE(wav.length - 4), 0);
    writeFileSync(new URL(`energy-${kind}.wav`, output), wav);
    console.log(
      `${kind}: ${(frames / 44100).toFixed(2)}s, peak ${peak.toFixed(3)}, sustained RMS ${late.toFixed(3)}`,
    );
  }
} finally {
  await browser.close();
}
