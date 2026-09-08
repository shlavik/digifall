import assert from "node:assert/strict";
import test from "node:test";

import { PHASES } from "../src/constants.js";
import {
  createEnergyFeedback,
  getEnergyBarLayout,
  getEnergyGainSegments,
} from "../src/energy-feedback.js";

const live = { seed: 123, active: true, phase: PHASES.idle };

test("energy layout preserves the original folded overflow gauge", () => {
  for (const [value, left, right] of [
    [0, 0, 0],
    [15, 0.15, 0],
    [100, 1, 0],
    [101, 0.99, 0.01],
    [110, 0.9, 0.1],
    [120, 0.8, 0.2],
    [150, 0.5, 0.5],
    [200, 0, 1],
    [250, 0, 1],
  ]) {
    assert.deepEqual(getEnergyBarLayout(value), {
      extra: value > 100,
      left,
      right,
    });
  }
});

test("gain glows use leftward overflow geometry and a low-energy recovery wave", () => {
  assert.deepEqual(getEnergyGainSegments(12, 38), {
    normal: { offset: 12, width: 26 },
    overflow: { offset: 0, width: 0 },
    recovery: { offset: 38, width: 62 },
  });
  assert.deepEqual(getEnergyGainSegments(95, 120), {
    normal: { offset: 95, width: 5 },
    overflow: { offset: 0, width: 20 },
    recovery: null,
  });
  assert.deepEqual(getEnergyGainSegments(120, 150), {
    normal: { offset: 100, width: 0 },
    overflow: { offset: 20, width: 30 },
    recovery: null,
  });
  assert.equal(getEnergyGainSegments(20, 30).recovery, null);
  assert.equal(getEnergyGainSegments(19, 100).recovery, null);
});

function observer(value = 100) {
  const observe = createEnergyFeedback();
  assert.equal(observe({ value, buffer: 0 }, live), null);
  return observe;
}

test("buffered energy transactions emit once, not on drain frames", () => {
  const observe = observer();
  assert.deepEqual(observe({ value: 100, buffer: -10 }, live), {
    from: 100,
    to: 90,
    amount: -10,
    gain: false,
    digit: null,
    fromDigit: null,
  });
  for (const value of [97, 95, 93, 92, 91, 90]) {
    assert.equal(observe({ value, buffer: 90 - value }, live), null);
  }
  assert.deepEqual(observe({ value: 90, buffer: 25 }, live), {
    from: 90,
    to: 115,
    amount: 25,
    gain: true,
    digit: null,
    fromDigit: null,
  });
  for (const value of [95, 99, 103, 106, 109, 111, 113, 114, 115]) {
    assert.equal(observe({ value, buffer: 115 - value }, live), null);
  }
});

test("spend feedback retains both digit colors, including 9 → 0", () => {
  for (let digit = 0; digit <= 9; digit++) {
    const observe = observer();
    const fromDigit = (digit + 9) % 10;
    const change = observe(
      { value: 100, buffer: -10 },
      { ...live, digit, fromDigit },
    );
    assert.equal(change.digit, digit);
    assert.equal(change.fromDigit, fromDigit);
    assert.equal(
      observe({ value: 97, buffer: -7 }, { ...live, digit: null }),
      null,
    );
    assert.equal(change.digit, digit);
  }
});

test("gains and final drain do not inherit a card's spend color", () => {
  const observe = observer(30);
  assert.equal(
    observe({ value: 30, buffer: 20 }, { ...live, digit: 8 }).digit,
    null,
  );
  assert.equal(observe({ value: 50, buffer: 0 }, live), null);
  assert.equal(
    observe(
      { value: 50, buffer: -50 },
      { ...live, phase: PHASES.gameOver, digit: 8 },
    ).digit,
    null,
  );
});

test("rapid mode direct changes retain each transaction", () => {
  const observe = observer();
  assert.equal(observe({ value: 90, buffer: 0 }, live).amount, -10);
  assert.equal(observe({ value: 96, buffer: 0 }, live).amount, 6);
  assert.equal(observe({ value: 86, buffer: 0 }, live).amount, -10);
});

test("mount, restoration and reset establish silent baselines", () => {
  const observe = observer();
  assert.equal(
    observe({ value: 20, buffer: 0 }, { ...live, active: false }),
    null,
  );
  assert.equal(
    observe({ value: 40, buffer: 0 }, { ...live, active: false }),
    null,
  );
  assert.equal(observe({ value: 40, buffer: 0 }, live), null);
  assert.equal(observe({ value: 30, buffer: 0 }, live).amount, -10);
  assert.equal(
    observe({ value: 100, buffer: 0 }, { ...live, seed: 456 }),
    null,
  );
  assert.equal(
    observe({ value: 90, buffer: 0 }, { ...live, seed: 456 }).amount,
    -10,
  );
});

test("overflow conversion is not a spend and establishes the next baseline", () => {
  const observe = observer(120);
  const overflow = { ...live, phase: PHASES.extra };
  assert.equal(observe({ value: 120, buffer: -20 }, overflow), null);
  assert.equal(observe({ value: 110, buffer: -10 }, overflow), null);
  assert.equal(observe({ value: 100, buffer: 0 }, overflow), null);
  assert.equal(observe({ value: 90, buffer: 0 }, live).amount, -10);
});

test("game-over drain accents once and initial shuffle stays silent", () => {
  const observe = observer(7);
  const ending = { ...live, phase: PHASES.gameOver };
  assert.equal(observe({ value: 7, buffer: -7 }, ending).amount, -7);
  for (const value of [6, 5, 4, 3, 2, 1, 0]) {
    assert.equal(observe({ value, buffer: -value }, ending), null);
  }
  assert.equal(
    observe({ value: 100, buffer: 0 }, { ...live, phase: PHASES.initial }),
    null,
  );
});
