# Digifall Sounds

[`src/sounds.js`](../../src/sounds.js) owns playback integration. Existing game samples use Howler; energy uses [`src/energy-synth.js`](../../src/energy-synth.js) through Howler's public `ctx` and `masterGain`, without creating a second audio context. The primary [`Energy.svelte`](../../src/Energy.svelte) surface owns energy timing; its game-over duplicate is inaudible.

## Energy timbre

The local candidate blends energetic noise with the soft, singing resonance of [Synesthesia](https://miaai-lab.github.io/Claude-Fable-5.1-Beautiful-HTML/). It is sustained synthesis, not a short pluck or a looping recording of a whole animation.

- `Charge`: Sine body, quiet triangle sub-octave, a restrained 2.76× bell partial, and sustained filtered noise. Instrument gain is 0.12.
- `Spend`: The same tonal/noise family with a quieter octave partial and gain 0.10.
- `Overflow`: A soft major triad with light high-passed noise, following audition 05's direction. Each chord branch has gain 0.045.
- `Room`: Shared 0.9-second stereo convolution impulse, 12 ms pre-delay, and wet gain 0.23 relative to the dry bus. The release begins at the effect's end and lasts 160 ms; the short room tail can finish naturally.

Noise and impulse buffers use a local seeded generator. This sound design is presentation-only and never enters replay simulation.

## Visible-energy pitch and duration

The **visible reserve** supplied by the energy surface selects pitch continuously:

```text
rate = 2 ** ((clamp(visibleEnergy, 0, 200) - 100) / 100)
```

This is the reserve behind the folded bar layout, not raw white-band width. Above 100%, the colored band grows from the right while pitch continues upward. Neither score, delta size, nor the already credited target selects pitch.

During gains, the tone holds through the approved 300 ms white-fill delay, then follows the 420 ms fill. It sustains through the 900 ms gain effect. Spending normally sustains through its 480 ms trail. Pitch changes use 8 ms smoothing to avoid audible stepping; releasing voices are not retuned by subsequent transactions.

Game-over audio follows the actual final drain, even when it outlasts the spend trail. Reduced motion skips the decorative fill delay: buffered changes follow the visible counter until the buffer empties, while instantaneous changes receive only an 80 ms cue. A 3-second audio deadline bounds drain cues if their completion notification is missed.

## Overflow and cleanup

The actual reserve crossing 100 owns the bonus episode, but its chord pitch follows the visible reserve throughout conversion. Counter ticks do not restart it. A minimum 450 ms episode hold preserves synchronous rapid-mode overflow; after that, returning to 100 releases the chord. Re-entry crossfades into a fresh chord rather than abruptly cutting its predecessor.

At most one current accent, one retiring accent, one bonus chord and one retiring chord exist. Mute, reset/restoration, surface teardown, page hiding, and audio-context suspension stop energy sources and disconnect the shared room, so an old tail cannot reappear after unmute. Context resume may start only the current, still-unexpired event at its latest visible pitch. If Web Audio is unavailable, energy synthesis is skipped while other Howler sounds remain available.

## Auditioning the production instrument

With development dependencies and Playwright Chromium installed:

```bash
node scripts/generate-energy-sounds.mjs
# Or use an installed Chrome:
CHROME_PATH=/usr/bin/google-chrome node scripts/generate-energy-sounds.mjs
```

Optional arguments are `charge`, `spend`, and `overflow`. The runner renders the actual synthesis module through `OfflineAudioContext`, using illustrative visible-energy trajectories, and checks sustained level, release decay and waveform headroom. Stereo PCM16 previews are written to `dist/energy-sounds/` at game instrument gain, not loudness-normalized. It does not write production assets; a build clears these generated previews.

See the [test guide](../../test/README.md) for real-browser synchronization and lifecycle checks. Physical-phone listening and final mix acceptance remain in the [backlog](../../BACKLOG.md).
