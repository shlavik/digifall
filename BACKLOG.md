# Backlog

Canonical open-work file for Digifall. Completed delivery history lives in [CHANGELOG.md](CHANGELOG.md); durable project protocol lives in [AGENTS.md](AGENTS.md).

## Active

- [ ] `Onboarding/tutorial`: Design and implement a lightweight learning path for new players
  - Exit criteria: First-time players can understand the core move rule, falling/combo behavior, energy pressure, and leaderboard goal without external explanation
  - Exit criteria: Tutorial/onboarding does not compromise deterministic replay validation or core game logic
  - Exit criteria: Returning players can skip or disable the learning flow

- [ ] `Energy ghost diff`: Reconcile and, if still desired, implement the proposed energy-gain ghost animation in `src/Energy.svelte`
  - Exit criteria: Positive energy gains within the 0-100 range show a temporary color-cycling ghost segment between previous and new values
  - Exit criteria: Main bar/value update is delayed or tweened without Svelte 5 reactive loops
  - Exit criteria: Low-energy warning and game-over flip behavior remain unchanged

## Notes

- Previous continuity notes claimed the Energy ghost diff was complete, but current source does not contain that implementation; treat it as unlanded until code changes.
