import {
  frequencyTable,
  numbersToNotes,
  getNoteId
} from "../lib/noteHelpers.js";
import AudioNode from "./AudioNode.js";
import { Observer } from "../lib/Observable.js";

const CUTOFF_AMPLITUDE = 10;

class NoteDetector extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "NoteDetector";
    this._interval = null;
    this._intervalId = null;
    this.playingId = null;
    this.playingNote = null;
    this.observers = [];
    this.interval = options.interval;

    this.node = this.context.createAnalyser();
    this.node.fftSize = 4096;
    this.node.minDecibels = -50;
    this.node.maxDecibels = -10;
    this.node.smoothingTimeConstant = 0.2;
    this.buffer = new Uint8Array(this.node.frequencyBinCount);
  }

  set interval(value) {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._intervalId = setInterval(this.update.bind(this), value);
    this._interval = value;
  }

  get interval() {
    return this._interval;
  }

  getAudioNode() {
    return this.node;
  }

  getDominantFrequency() {
    const { node, buffer } = this;
    node.getByteFrequencyData(buffer);
    let maxIndex = 0;
    let maxAmplitude = 0;
    for (let i = 0; i < buffer.length * 0.75; i++) {
      if (buffer[i] > maxAmplitude) {
        maxIndex = i;
        maxAmplitude = buffer[i];
      }
    }
    if (maxAmplitude < CUTOFF_AMPLITUDE) {
      return null;
    }
    console.log(maxAmplitude);
    const sampleRate = this.context.sampleRate;
    const nyquist = sampleRate / 2;
    return maxIndex * (nyquist / buffer.length);
  }

  getNearestNote(frequency) {
    let i = 0;
    let difference = frequencyTable[i] - frequency;
    while (difference < 0 && i < 128) {
      i++;
      difference = frequencyTable[i] - frequency;
    }
    if (difference < 0) {
      return null;
    }

    const previousDifference = frequencyTable[i - 1] - frequency;
    if (Math.abs(previousDifference) < difference) {
      return numbersToNotes[i - 1];
    } else {
      return numbersToNotes[i];
    }
  }

  update() {
    const dominant = this.getDominantFrequency();
    if (!dominant) {
      if (this.playingId) {
        this.notify({ type: "stop", id: this.playingId });
        this.playingId = null;
        this.playingNote = null;
      }
      return;
    }

    const note = this.getNearestNote(dominant);
    if (!this.playingId) {
      this.playingId = getNoteId();
      this.playingNote = note;
      this.notify({ type: "play", note, id: this.playingId });
    } else if (this.playingNote !== note) {
      const oldId = this.playingId;
      const newId = getNoteId();
      this.notify({ type: "stop", id: oldId });
      this.notify({ type: "play", note, id: newId });
      this.playingId = newId;
      this.playingNote = note;
    }
  }

  // Observable
  observe(handler) {
    const observer = new Observer(this, handler);
    this.observers.push(observer);
    return observer;
  }

  removeObserver(observer) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex > -1) {
      this.observers.splice(observerIndex, 1);
    } else {
      throw new Error("Observable can't remove observer it doesn't own");
    }
  }

  notify(event) {
    this.observers.forEach(observer => observer.notify(event));
  }
}

NoteDetector.configTypes = {
  interval: "number"
};

export default NoteDetector;
