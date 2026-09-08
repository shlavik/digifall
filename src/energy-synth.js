/** Energy timbre and bounded Web Audio voices; excludes game state and UI timing. */
export function getEnergySoundRate(energy) {
  return 2 ** ((Math.max(0, Math.min(energy, 200)) - 100) / 100);
}

export function createEnergySynth(context, destination) {
  const releaseTime = 0.16;
  const voices = new Set();
  let accent;
  let retiring;
  let bonus;
  let retiringBonus;
  let bonusStarted;
  let graph;
  let bonusWanted = false;
  let holdTimer;
  const rate = context.sampleRate;
  let seed = 1618033;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
  };
  const impulse = context.createBuffer(2, Math.round(rate * 0.9), rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < data.length; i++)
      data[i] = random() * Math.exp((-8 * i) / data.length);
  }
  const noise = context.createBuffer(1, rate, rate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = random();
  const driveCurve = Float32Array.from({ length: 4096 }, (_, i) => {
    const x = (2 * i) / 4095 - 1;
    return Math.tanh(1.25 * x) / Math.tanh(1.25);
  });

  function getGraph() {
    if (graph) return graph;
    const bus = context.createGain();
    const room = context.createConvolver();
    const delay = context.createDelay();
    const wet = context.createGain();
    room.buffer = impulse;
    delay.delayTime.value = 0.012;
    wet.gain.value = 0.23;
    bus.connect(destination);
    bus.connect(delay).connect(room).connect(wet).connect(destination);
    graph = { bus, nodes: [bus, delay, room, wet] };
    return graph;
  }

  function voice(kind, energy, duration) {
    const start = context.currentTime;
    const level = kind === "bonus" ? 0.045 : kind === "gain" ? 0.12 : 0.1;
    const envelope = context.createGain();
    const nodes = [envelope];
    const sources = [];
    const tones = [];
    let end = start + duration;
    let released = false;
    let stopped = false;
    let currentEnergy = energy;
    envelope.connect(getGraph().bus);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(
      level,
      start + (kind === "bonus" ? 0.04 : 0.004),
    );
    if (Number.isFinite(end)) scheduleEnd(end);

    function scheduleEnd(time) {
      envelope.gain.setValueAtTime(level, time);
      envelope.gain.exponentialRampToValueAtTime(
        0.00001,
        time + releaseTime - 0.006,
      );
      envelope.gain.linearRampToValueAtTime(0, time + releaseTime);
    }
    function branch(multiplier) {
      const filter = context.createBiquadFilter();
      const drive = context.createWaveShaper();
      filter.type = "lowpass";
      filter.Q.value = 0.65;
      filter.frequency.value = kind === "bonus" ? 2600 : 3400;
      drive.curve = driveCurve;
      drive.oversample = "2x";
      filter.connect(drive).connect(envelope);
      nodes.push(filter, drive);
      function tone(type, harmonic, volume) {
        const source = context.createOscillator();
        const gain = context.createGain();
        const base = 440 * multiplier * harmonic;
        source.type = type;
        source.frequency.value = base * getEnergySoundRate(energy);
        gain.gain.value = volume;
        source.connect(gain).connect(filter);
        tones.push({ source, base });
        sources.push(source);
        nodes.push(source, gain);
      }
      tone("sine", 1, 0.65);
      tone("triangle", 0.5, 0.18);
      tone("sine", kind === "gain" ? 2.76 : 2, kind === "gain" ? 0.12 : 0.08);
      const source = context.createBufferSource();
      const highpass = context.createBiquadFilter();
      const gain = context.createGain();
      const noiseLevel = 0.38 * (kind === "bonus" ? 0.22 : 1);
      source.buffer = noise;
      source.loop = true;
      highpass.type = "highpass";
      highpass.frequency.value = kind === "bonus" ? 1600 : 800;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(noiseLevel, start + 0.002);
      gain.gain.linearRampToValueAtTime(noiseLevel * 0.45, start + 0.05);
      source.connect(highpass).connect(gain).connect(filter);
      sources.push(source);
      nodes.push(source, highpass, gain);
    }
    if (kind === "bonus") {
      for (const semitone of [0, 4, 7]) branch(0.5 * 2 ** (semitone / 12));
    } else branch(1);

    const result = {
      update(visibleEnergy) {
        if (
          stopped ||
          released ||
          context.currentTime >= end ||
          visibleEnergy === currentEnergy
        )
          return;
        currentEnergy = visibleEnergy;
        for (const { source, base } of tones) {
          source.frequency.setTargetAtTime(
            base * getEnergySoundRate(visibleEnergy),
            context.currentTime,
            0.008,
          );
        }
      },
      release() {
        if (stopped || released || context.currentTime >= end) return;
        released = true;
        end = context.currentTime;
        const param = envelope.gain;
        if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(end);
        else {
          const value = param.value;
          param.cancelScheduledValues(end);
          param.setValueAtTime(value, end);
        }
        param.exponentialRampToValueAtTime(0.00001, end + releaseTime - 0.006);
        param.linearRampToValueAtTime(0, end + releaseTime);
        for (const source of sources) source.stop(end + releaseTime);
      },
      stop() {
        if (stopped) return;
        stopped = true;
        sources.at(-1).onended = null;
        for (const source of sources) source.stop();
        for (const node of nodes) node.disconnect();
        voices.delete(result);
      },
    };
    sources.at(-1).onended = () => {
      stopped = true;
      for (const node of nodes) node.disconnect();
      voices.delete(result);
    };
    voices.add(result);
    for (const source of sources) {
      source.start(start);
      if (Number.isFinite(end)) source.stop(end + releaseTime);
    }
    return result;
  }

  function stop() {
    clearTimeout(holdTimer);
    for (const item of [...voices]) item.stop();
    for (const node of graph?.nodes ?? []) node.disconnect();
    graph = null;
    accent = retiring = bonus = retiringBonus = null;
    bonusWanted = false;
  }

  return {
    play(kind, energy, duration) {
      retiring?.stop();
      accent?.release();
      retiring = accent;
      accent = voice(kind, energy, duration);
    },
    releaseAccent() {
      accent?.release();
    },
    updateEnergy(energy) {
      accent?.update(energy);
      bonus?.update(energy);
    },
    overflow(wanted, energy) {
      if (wanted === bonusWanted) return;
      bonusWanted = wanted;
      clearTimeout(holdTimer);
      if (wanted) {
        retiringBonus?.stop();
        bonus?.release();
        retiringBonus = bonus;
        bonus = voice("bonus", energy, Infinity);
        bonusStarted = context.currentTime;
      } else {
        const current = bonus;
        holdTimer = setTimeout(
          () => {
            if (!bonusWanted && bonus === current) current?.release();
          },
          Math.max(0, 450 - (context.currentTime - bonusStarted) * 1000),
        );
      }
    },
    stop,
  };
}
