import AudioNode from "./AudioNode.js";
import Oscillator from "./Oscillator.js";

export default class AudioContext {
  constructor() {
    this.destination = new AudioNode();
  }

  createOscillator() {
    return new Oscillator();
  }
}