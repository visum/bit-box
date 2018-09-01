import { freqFromNote } from "../helpers.js";
import ADSREnvelope from "../envelopes/ADSREnvelope.js";

export default class BasicOscillator {
  constructor(options) {
    if (!options.context) {
      throw new Error("An audio context instance is required.");
    }

    this.activeNotes = {};
    this.noteCache = [];
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

  getNote() {
    if (this.noteCache.length === 0) {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.connect(gain);
      oscillator.start();
      return {oscillator: oscillator, gain: gain};
    } else {
      return this.noteCache.pop();
    }
  }

  cacheNote(note) {
    note.gain.disconnect();
    this.noteCache.push(note);
  }

  notify(event) {
    if (event.type === "noteOn") {
      this.noteOn(event.note, event.velocity);
    } else if (event.type === "noteOff") {
      this.noteOff(event.note);
    }
  }

  noteOn(noteName, velocity) {
    const { context, activeNotes, waveType, audioTarget } = this;
    if (activeNotes[noteName]) {
      return;
    }
    const frequency = freqFromNote(noteName);
    const note = this.getNote();
    const { oscillator, gain } = note;
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

    gain.connect(audioTarget.getAudioNode());
    activeNotes[noteName] = note;
  }

  noteOff(noteName) {
    const { context, activeNotes } = this;
    if (!activeNotes[noteName]) {
      return;
    }
    const note = activeNotes[noteName];
    const { gain } = note;
    const volumeEnvelope = this.volumeEnvelope;
    // baseline for release fade
    gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
    // release fade    
    gain.gain.linearRampToValueAtTime(volumeEnvelope.release.volume, context.currentTime + volumeEnvelope.release.delay);

    // make note available for replay immediately
    this.activeNotes[noteName] = null;

    setTimeout(() => {
      this.cacheNote(note);
    }, (volumeEnvelope.release.delay * 1000) + 10);
  }

  panic() {
    const { activeNotes } = this;
    Object.keys(activeNotes).forEach(note => {
      this.cacheNote(activeNotes[note]);
      activeNotes[note] = null;
    });
  }
}
