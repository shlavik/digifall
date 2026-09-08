# Tests

All project tests live here, named for their owning domain. Production modules must not import this test harness; `npm run check:domains` includes these files and enforces the dependency direction.

## Fast checks

```bash
npm test
npm run check
npm run lint
npm run check:domains
```

`npm test` runs core/replay, energy transaction and audio-pitch, persistence, leaderboard, and Android SDK tests once. `npm test --workspaces` runs only the leaderboard package's tests through its workspace entrypoint.

## Browser energy checks

```bash
npx playwright install chromium
npm run test:browser
```

Alternatively, use an installed Chrome executable:

```bash
CHROME_PATH=/usr/bin/google-chrome npm run test:browser
```

The harness starts and closes its own loopback-only Vite server and isolated browser. P2P is disabled. It checks all ten old-to-new digit color transitions in normal and rapid mode, glow-before-fill timing, settling/recovery waves, folded overflow geometry, native oscillator pitch against the visible fill, sustain through effect completion, suspended-context wake, mute/background cleanup, reduced motion, bounded rapid replacement, overflow-chord lifecycles, reset/replay silence, and the two game-over surfaces.

Screenshots go to `dist/energy-check/`, which is generated and cleared by the next production build. They include controlled test states, not verified game records. Review screenshots for visual quality; DOM/native-audio assertions do not replace physical-device animation and listening checks. `scripts/generate-energy-sounds.mjs` also renders the production instrument offline and checks sustain, release and waveform headroom; see the [sound guide](../public/sounds/README.md).
