# Backlog

Canonical open-work file for Digifall. Completed delivery history lives in [CHANGELOG.md](CHANGELOG.md); durable project protocol lives in [AGENTS.md](AGENTS.md).

## Active

- [ ] `Digifall on-chain pallet`: Port the deterministic game protocol into a standalone `no_std` Rust FRAME pallet under `chain/`
  - [x] `Deterministic engine`: Preserve the 6×6 stable-card state, integer PRNG, matching, falling, combo, energy, and terminal-score semantics without storing move history; proved by the shared seed-7 JavaScript behavior vector and Rust engine tests
  - [x] `Pallet lifecycle`: Store one bounded game per owner, custody configurable stake assets, bind each commitment to one bounded scheduled post-commit randomness sample, authorize a sufficient-reference-backed session account, settle or recover all terminal paths, and mint a separately configured reward asset from stake and score
  - [x] `Sponsored moves`: Valid session-controlled progress calls are fee-free through the strict-current nonce and payment-wrapper pipeline; mock-runtime extension tests admit an unfunded sufficient-reference-backed session, reject unrelated paid calls and future-nonce duplicate chains, and bind replay protection to game ID plus revision
  - [x] `Template verification`: The Polkadot SDK 2606 Cumulus runtime composes native stake, asset rewards, sponsored transaction extensions, `ParachainSystem`, and `register_validate_block!`; SCALE-round-tripped signed-extrinsic tests prove fee-free progress, stale replay rejection, and payment failure for unrelated unfunded calls, while lifecycle/economic tests, `no_std` checks, and the locked release Wasm build pass
  - [ ] `Production gates`: The template runtime now uses weights generated from the benchmark-enabled Wasm with `frame-omni-bencher` (50 steps, 20 repeats), covering all calls, hook/predicate work, queue bounds, active rotation, settlement, fault cleanup, and conservative per-budget resolution; select a manipulation-resistant randomness source and final reward policy, then regenerate weights on the target production hardware/runtime before economic activation; buyback and burn remain out of scope
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
