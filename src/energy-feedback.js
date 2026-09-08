import { PHASES } from "./constants.js";

const percent = (value) => Math.max(0, Math.min(value, 100));

/** Original folded gauge: white grows from the left, overflow grows from the right. */
export function getEnergyBarLayout(value) {
  const extra = value > 100;
  return {
    extra,
    left: percent(extra ? 200 - value : value) / 100,
    right: extra ? percent(value - 100) / 100 : 0,
  };
}

/** Glow previews both sides of the 100% boundary before their fills catch up. */
export function getEnergyGainSegments(from, to) {
  return {
    normal: {
      offset: percent(from),
      width: Math.max(0, percent(to) - percent(from)),
    },
    overflow: {
      offset: percent(from - 100),
      width: Math.max(0, percent(to - 100) - percent(from - 100)),
    },
    recovery:
      from < 20 && to < 100
        ? { offset: percent(to), width: 100 - percent(to) }
        : null,
  };
}

/**
 * Observes energy transactions, not individual buffer-drain frames.
 * Owns presentation only: never writes game state or schedules core work.
 */
export function createEnergyFeedback() {
  let previousTarget = null;
  let previousSeed;
  return function observe(
    { value, buffer },
    { seed, active, phase, digit = null, fromDigit = null },
  ) {
    const target = value + buffer;
    const from = buffer === 0 ? previousTarget : value;
    const changed = previousTarget !== null && target !== previousTarget;
    const sameGame = seed === previousSeed;
    previousTarget = target;
    previousSeed = seed;
    if (!active || !sameGame || !changed) return null;
    // Overflow is converted into score; it is not a player energy expense.
    if (phase === PHASES.initial || phase === PHASES.extra) return null;
    const amount = target - from;
    if (amount === 0) return null;
    return {
      from,
      to: target,
      amount,
      gain: amount > 0,
      digit: amount < 0 && phase !== PHASES.gameOver ? digit : null,
      fromDigit: amount < 0 && phase !== PHASES.gameOver ? fromDigit : null,
    };
  };
}
