import { freqFromNote } from "../helpers.js";

export default class BasicOscillator {
  constructor(options) {
    if (!options.context) {
      throw new Error("An audio context instance is required.");
    }
    this.oscillators = {};
    this.waveType = options.waveType || "sine";
    this.context = options.context;
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

    gain.gain.setValueAtTime(volume, context.currentTime);

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    oscillator.connect(gain);
    oscillator.start();

    gain.connect(audioTarget);
    oscillators[note] = { oscillator: oscillator, gain: gain };
  }

  noteOff(note) {
    const { context, oscillators } = this;
    if (!oscillators[note]) {
      return;
    }
    const { oscillator, gain } = oscillators[note];
    // fade out to avoid a nasty click when the oscillator stops mid-wave
    gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.01);

    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
      this.oscillators[note] = null;
    }, 10);
  }

  panic() {
    const { oscillators } = this;
    Object.keys(oscillators).forEach(key => {
      oscillators[key].stop();
      oscillators[key] = null;
    });
  }
}
