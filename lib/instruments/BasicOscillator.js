import { freqFromNote } from "../helpers.js";
import ADSREnvelope from "../envelopes/ADSREnvelope.js";

export default class BasicOscillator {
  constructor(options) {
    if (!options.context) {
      throw new Error("An audio context instance is required.");
    }
    this.oscillators = {};
    this.waveType = options.waveType || "sine";
    this.context = options.context;
    this.volumeEnvelope = options.volumeEnvelope || new ADSREnvelope();
    if (options.audioTarget) {
      this.audioTarget = options.audioTarget;
    }
  }

  setAudioTarget(target) {
    this.audioTarget = target;
  }

  notify(event) {
    if (event.type === "noteOn") {
      this.noteOn(event.note, event.velocity);
    } else if (event.type === "noteOff") {
      this.noteOff(event.note);
    }
  }

  noteOn(note, velocity) {
    const { context, oscillators, waveType, audioTarget } = this;
    if (oscillators[note]) {
      return;
    }
    const frequency = freqFromNote(note);
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const volume = velocity / 127;
    const volumeEnvelope = this.volumeEnvelope;

    // baseline
    gain.gain.setValueAtTime(0, this.context.currentTime);
    // attack
    const attackTime = context.currentTime + volumeEnvelope.attack.delay;
    gain.gain.linearRampToValueAtTime(volume * volumeEnvelope.attack.volume, attackTime);
    // decay
    const decayTime = attackTime + volumeEnvelope.decay.delay;
    gain.gain.linearRampToValueAtTime(volume * volumeEnvelope.decay.volume, decayTime);
    // sustain
    const sustainTime = decayTime + volumeEnvelope.sustain.delay;
    gain.gain.linearRampToValueAtTime(volume * volumeEnvelope.sustain.volume, sustainTime);

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    oscillator.connect(gain);
    oscillator.start();

    gain.connect(audioTarget);
    oscillators[note] = { oscillator: oscillator, gain: gain, volumeEnvelope: volumeEnvelope };
  }

  noteOff(note) {
    const { context, oscillators } = this;
    if (!oscillators[note]) {
      return;
    }
    const { oscillator, gain } = oscillators[note];
    const volumeEnvelope = this.volumeEnvelope;
    // baseline for release fade
    gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
    // release fade    
    gain.gain.linearRampToValueAtTime(volumeEnvelope.release.volume, context.currentTime + volumeEnvelope.release.delay);

    // make note available for replay immediately
    this.oscillators[note] = null;

    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();

    }, (volumeEnvelope.release.delay * 1000) + 10);
  }

  panic() {
    const { oscillators } = this;
    Object.keys(oscillators).forEach(key => {
      oscillators[key].stop();
      oscillators[key] = null;
    });
  }
}
