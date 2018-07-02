import Instrument from "./Instrument.js";
import { freqFromNote } from "../helpers.js";

// todo: memory leak with gain nodes?

export default class Sine extends Instrument {
  constructor(context) {
    super(context);
    this.oscillators = {};
  }

  setAudioOutput(output) {
    this.output = output;
  }

  noteOn(note, velocity) {
    const { context, output } = this;
    const frequency = freqFromNote(note);
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    gain.gain.setValueAtTime(velocity, context.currentTime);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    oscillator.connect(gain);
    oscillator.start();

    gain.connect(output);
    this.oscillators[note] = {oscillator:oscillator, gain:gain};
  }

  noteOff(note) {
    const {oscillator, gain} = this.oscillators[note];
    oscillator.stop();
    oscillator.disconnect();
    gain.disconnect();
    this.oscillators[note] = null;
  }

  panic() {
    const { oscillators } = this;
    Object.keys(oscillators).forEach(key => {
      oscillators[key].stop();
      oscillators[key] = null;
    });
  }
}
