import BasicOscillator from "./BasicOscillator.js";

export default class SineInstrument {
  constructor({context, type, target}) {
    this.context = context;
    this.type = type;
    this.target = target;
    this.nextKey = 0;
    this.notes = {};
  }

  play({frequency, duration}) {
    const noteKey = this.nextKey;
    const note = new BasicOscillator({frequency, context: this.context, type:this.type, target: this.target});
    this.notes[noteKey] = note;
    if (duration) {
      setTimeout(() => {
        this.stop(noteKey);
      }, duration);
    }
    note.start();
    this.nextKey += 1;
    return noteKey;
  }

  stop(key) {
    const note = this.notes[key];
    if (note) {
      note.stop();
      this.notes[key] = null;
    }
  }

}