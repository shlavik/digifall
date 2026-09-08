<script>
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion, Tween } from "svelte/motion";

  import { PHASES } from "./constants.js";
  import { getNextCardValue } from "./core.js";
  import {
    createEnergyFeedback,
    getEnergyBarLayout,
    getEnergyGainSegments,
  } from "./energy-feedback.js";
  import {
    playEnergyChange,
    playLowEnergy,
    releaseEnergyChange,
    stopEnergySounds,
    updateEnergyOverflow,
    updateEnergySound,
  } from "./sounds.js";
  import game, {
    cardsStore,
    checkSound,
    energyStore,
    optionsStore,
    phaseStore,
    plusIndexStore,
    seedStore,
  } from "./stores.js";

  let { gameOver = false, audible = true } = $props();
  let zeroFlipped = $state(false);
  let feedback = $state(null);
  let feedbackId = $state(0);
  let drainSound = $state(false);
  const GAIN_DELAY = 300;
  const fill = new Tween(energyStore.get().value, { duration: 0 });

  onMount(() => {
    const observe = createEnergyFeedback();
    let timeout;
    const unsubscribe = energyStore.subscribe((energy) => {
      const active = game.ready && game.movesInitial === null;
      const card = cardsStore.get()[plusIndexStore.get()];
      const change = observe(energy, {
        seed: seedStore.get(),
        active,
        phase: phaseStore.get(),
        digit: card ? getNextCardValue(card.value) : null,
        fromDigit: card ? card.value : null,
      });
      if (!active) {
        if (audible) stopEnergySounds();
        drainSound = false;
        clearTimeout(timeout);
        feedback = null;
        fill.set(energy.value, { duration: 0 });
        return;
      }
      if (!change) {
        if (!feedback?.gain) fill.set(energy.value, { duration: 0 });
        if (audible)
          checkSound(() =>
            updateEnergyOverflow(
              energyStore.get(),
              getShownEnergy(energyStore.get().value),
            ),
          );
        return;
      }
      clearTimeout(timeout);
      if (change.gain && !prefersReducedMotion.current) {
        const from = Math.min(fill.current, change.from);
        feedback = { ...change, from };
        // Cancel the previous chase before delaying the new one; core energy stays untouched.
        fill.set(from, { duration: 0 });
        fill.set(change.to, {
          delay: GAIN_DELAY,
          duration: 420,
          easing: cubicOut,
        });
      } else {
        feedback = change;
        fill.set(energy.value, { duration: 0 });
      }
      feedbackId++;
      const draining = phaseStore.get() === PHASES.gameOver;
      drainSound =
        draining ||
        (prefersReducedMotion.current && energyStore.get().buffer !== 0);
      const soundDuration = drainSound
        ? 3000
        : prefersReducedMotion.current
          ? 80
          : change.gain
            ? 900
            : 480;
      if (audible)
        checkSound(() => {
          const soundEnergy = getShownEnergy(energyStore.get().value);
          updateEnergyOverflow(energyStore.get(), soundEnergy);
          playEnergyChange(change, soundEnergy, soundDuration);
        });
      timeout = setTimeout(
        () => {
          feedback = null;
          fill.set(energyStore.get().value, { duration: 0 });
        },
        change.gain ? 900 : 640,
      );
    });
    const onVisibility = () => {
      if (document.hidden) stopEnergySounds();
    };
    if (audible) document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      unsubscribe();
      clearTimeout(timeout);
      fill.set(fill.current, { duration: 0 });
      if (audible) stopEnergySounds();
    };
  });

  let value = $derived($energyStore.value);
  function getShownEnergy(current) {
    return feedback?.gain && !prefersReducedMotion.current
      ? Math.min(fill.current, current)
      : current;
  }
  let shownValue = $derived(getShownEnergy(value));
  let layout = $derived(getEnergyBarLayout(shownValue));
  let extra = $derived(layout.extra);
  let segments = $derived(
    feedback?.gain ? getEnergyGainSegments(feedback.from, feedback.to) : null,
  );
  let warning = $derived(value < 20 && $phaseStore === PHASES.idle);
  let flashing = $derived(warning && !feedback?.gain);

  // Preserve the original folded bar and split-color numeral at the overflow boundary.
  let leftBarStyle = $derived(
    `z-index: ${extra ? 0 : 1}; flex: ${layout.left};`,
  );
  let leftValueStyle = $derived(
    `position: ${extra ? "absolute" : "relative"};`,
  );
  let rightBarStyle = $derived(
    `z-index: ${extra ? 1 : 0}; flex: ${layout.right};`,
  );
  let rightValueStyle = $derived(`
    position: ${extra ? "relative" : "absolute"};
    left: ${extra ? `calc(${shownValue > 119 ? 0 : (shownValue - 120) / 100} * 128rem)` : 0};
  `);

  $effect(() => {
    if (prefersReducedMotion.current) {
      fill.set(energyStore.get().value, { duration: 0 });
      if (audible) releaseEnergyChange();
    }
  });

  $effect(() => {
    if (!audible) return;
    if (!$optionsStore.sound) stopEnergySounds();
    else
      checkSound(() => {
        updateEnergySound(shownValue);
        updateEnergyOverflow(energyStore.get(), shownValue);
        if (drainSound && $energyStore.buffer === 0) {
          releaseEnergyChange();
          drainSound = false;
        }
      });
  });

  $effect(() => {
    if (warning && audible) checkSound(playLowEnergy);
  });

  $effect(() => {
    if (gameOver && !zeroFlipped) {
      const timeout = setTimeout(() => (zeroFlipped = true));
      return () => clearTimeout(timeout);
    }
  });
</script>

{#snippet gainGhost(segment, overflow = false)}
  <div
    class="energy-ghost gain-ghost"
    class:overflow
    style:left={overflow ? null : `${segment.offset}%`}
    style:right={overflow ? `${segment.offset}%` : null}
    style:width="{segment.width}%"
  >
    <div class="energy-spectrum"></div>
    <div class="energy-down-wave"></div>
  </div>
{/snippet}

<div class="energy" style:--energy-fill-delay="{GAIN_DELAY}ms">
  {#if feedback}
    {#key feedbackId}
      <div
        class="energy-feedback"
        class:gain={feedback.gain}
        style:--energy-color={feedback.digit === null
          ? "white"
          : `var(--color-${feedback.digit})`}
        style:--energy-color-from={feedback.fromDigit === null
          ? "white"
          : `var(--color-${feedback.fromDigit})`}
        aria-hidden="true"
      >
        {#if feedback.gain}
          {#if segments.normal.width > 0}
            {@render gainGhost(segments.normal)}
          {/if}
          {#if segments.recovery}
            <div
              class="energy-recovery"
              style:left="{segments.recovery.offset}%"
              style:width="{segments.recovery.width}%"
            >
              <div class="energy-recovery-wave"></div>
            </div>
          {/if}
        {:else}
          <div
            class="energy-ghost spend-ghost"
            style:left="{Math.max(0, feedback.to)}%"
            style:width="{Math.min(100, feedback.from) -
              Math.max(0, feedback.to)}%"
          ></div>
        {/if}
      </div>
    {/key}
  {/if}
  <div class="left-bar" class:warning={flashing} style={leftBarStyle}>
    {#if segments?.overflow.width > 0}
      {#key feedbackId}
        <div class="energy-overflow-feedback" aria-hidden="true">
          {@render gainGhost(segments.overflow, true)}
        </div>
      {/key}
    {/if}
    <span class="left-value" class:warning={flashing} style={leftValueStyle}
      >{value}</span
    >
  </div>
  <div class="right-bar" class:extra style={rightBarStyle}>
    <span
      class="right-value"
      class:warning={flashing}
      class:flip={zeroFlipped}
      style={rightValueStyle}
    >
      <span class="front">{value}</span>
      {#if gameOver}<span class="back">O</span>{/if}
    </span>
  </div>
  {#if gameOver}
    <span class="energy-out">
      {#each "ut of energy" as letter, index}
        <span
          class={letter === " " ? "space" : "letter"}
          style:animation-delay="{400 + index * 100}ms">{letter}</span
        >
      {/each}
    </span>
  {/if}
</div>

<style lang="postcss">
  :global .energy {
    position: relative;
    display: flex;
    width: 100%;
    height: 9rem;
    background-color: var(--color-dark);
    box-shadow: var(--shadow-inset), var(--gloss-inset);
    font-size: 7rem;
    letter-spacing: 0;
    text-indent: 1rem;

    .energy-feedback,
    .energy-overflow-feedback {
      position: absolute;
      z-index: 0;
      overflow: hidden;
      inset: 0;
      pointer-events: none;
    }

    .energy-ghost {
      position: absolute;
      height: 100%;
      transform-origin: left;
    }

    .spend-ghost {
      animation: energy-spend 480ms ease-out both;
    }

    .gain-ghost {
      overflow: hidden;
      animation: energy-gain 900ms ease-out both;
      box-shadow:
        0 0 1.5rem var(--color-8),
        inset 0 0 1rem white;

      &.overflow {
        transform-origin: right;
      }
    }

    .energy-spectrum {
      position: absolute;
      width: 200%;
      height: 100%;
      animation: energy-spectrum 700ms linear infinite;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-8), white 20%),
        color-mix(in srgb, var(--color-1), white 20%),
        color-mix(in srgb, var(--color-2), white 20%),
        color-mix(in srgb, var(--color-5), white 35%),
        color-mix(in srgb, var(--color-8), white 20%)
      );
      background-size: 50% 100%;
    }

    .energy-down-wave {
      position: absolute;
      width: 100%;
      height: 2rem;
      animation: energy-down-wave 340ms var(--energy-fill-delay) ease-out both;
      background: linear-gradient(transparent, white, transparent);
    }

    .energy-recovery {
      position: absolute;
      overflow: hidden;
      height: 100%;
    }

    .energy-recovery-wave {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: energy-recovery 460ms calc(var(--energy-fill-delay) + 40ms)
        ease-out both;
      background: linear-gradient(
        90deg,
        white,
        var(--color-8) 1rem,
        transparent 4rem
      );
    }

    .left-bar,
    .right-bar {
      overflow: hidden;
      padding: 1rem 0;
      box-shadow: var(--gloss), var(--shadow-1);
    }

    .left-bar {
      background-color: white;
      text-align: right;

      .left-value {
        z-index: 1;
        right: 0;
        color: var(--color-dark);
        transition: color 200ms ease;
      }
    }

    .right-bar {
      &.extra {
        background-color: var(--color-random);
      }

      .right-value {
        width: 7rem;
        height: 7rem;
        backface-visibility: hidden;
        color: white;
        transform-style: preserve-3d;
        transition: transform 800ms ease-in-out;

        &.flip {
          transform: rotateY(180deg);
        }

        .front,
        .back {
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          color: white;
        }

        .back {
          position: absolute;
          top: 0;
          transform: rotateY(180deg);
        }
      }
    }

    .energy-out {
      position: absolute;
      width: 100%;
      height: 7rem;
      padding-top: 3rem;
      padding-left: 9rem;
      color: white;
      font-size: 5rem;
      font-weight: bold;
      letter-spacing: 1rem;
      text-indent: 0;

      .letter,
      .space {
        display: inline-block;
        width: 7rem;
        padding-left: 1rem;
        animation: flip 400ms ease-in-out forwards;
        opacity: 0;
        perspective: 128rem;
        transform-style: preserve-3d;
      }
    }

    .warning {
      animation: flick 2s infinite;
    }
  }

  @keyframes energy-gain {
    0% {
      opacity: 0.95;
      transform: scaleX(0);
    }
    10%,
    80% {
      opacity: 1;
      transform: scaleX(1);
    }
    100% {
      opacity: 0;
      transform: scaleX(1);
    }
  }

  @keyframes energy-spectrum {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  @keyframes energy-spend {
    0%,
    20% {
      background-color: var(--energy-color-from);
      opacity: 0.95;
      transform: scaleX(1);
    }
    65% {
      background-color: var(--energy-color);
    }
    100% {
      background-color: var(--energy-color);
      opacity: 0;
      transform: scaleX(0);
    }
  }

  @keyframes energy-down-wave {
    from {
      opacity: 0.9;
      transform: translateY(-2rem);
    }
    to {
      opacity: 0;
      transform: translateY(9rem);
    }
  }

  @keyframes energy-recovery {
    0% {
      opacity: 0;
      transform: translateX(-4rem);
    }
    15% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global .energy {
      .energy-feedback,
      .energy-overflow-feedback {
        display: none;
      }
      .warning,
      .energy-out .letter,
      .energy-out .space {
        animation: none;
        opacity: 1;
      }
      .right-bar .right-value {
        transition: none;
      }
    }
  }

  @keyframes flick {
    20%,
    25%,
    30%,
    35% {
      opacity: 1;
    }
    21%,
    24%,
    31%,
    34% {
      opacity: 0;
    }
  }

  @keyframes flip {
    0% {
      opacity: 1;
      transform: rotateY(90deg);
    }
    100% {
      opacity: 1;
      transform: rotateY(0);
    }
  }
</style>
