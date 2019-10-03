import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";

/**
 * Not yet working. Need to come back to it.
 * 
 * The idea is to detect the dominant frequency of the input sound,
 * then find the frequency of the note given by a "play" event,
 * calculate the difference in cents,
 * then set the detune on the biquad filter.
 */

class AutoTune extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "AutoTune";
    this._refreshInterval = null;
    this.intervalId = null;;

    EventTarget.apply(this);

    this.biquad = this.context.createBiquadFilter();
    this.analyzer = this.context.createAnalyser();

    this.analyzer.fftSize = 2048;
    this.analyzer.minDecibels = -55;
    this.analyzer.maxDecibels = -10;
    this.analyzer.smoothingTimeConstant = 0.2;
    this.buffer = new Uint8Array(this.analyzer.frequencyBinCount);

    this.analyzer.connect(this.biquad);

    this.biquad.type = "highpass";

    this.eventHandlers = {
      play: ({delta}) => {
        this.biquad.detune.setValueAtTime(delta * 100, this.context.currentTime);
      },
      stop: () => {
        this.biquad.detune.setValueAtTime(0, this.context.currentTime);
      }
    }

    this.refreshInterval = options.refreshInterval;
  }

  set refreshInterval(value) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      const f = this.getDominantFrequency();
      console.log(f);
    }, value);
    this._refreshInterval = value;
  }

  get refreshInterval() {
    return this._refreshInterval;
  }

  getDominantFrequency() {
    const {analyzer, buffer} = this;
    analyzer.getByteFrequencyData(buffer);
    let maxIndex = 0;
    let maxAmplitude = 0;
    // don't need to bother with the very uppers
    for (let i = 0; i < (buffer.length * 0.75); i ++) {
      if (buffer[i] > maxAmplitude) {
        maxIndex = i;
        maxAmplitude = buffer[i];
      }
    }
    const sampleRate = this.context.sampleRate;
    const nyquist = sampleRate / 2;
    return maxIndex * (nyquist / buffer.length);
  }

  getAudioNode() {
    return this.analyzer;
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error("AutoTune connection target does not implement getAudioNode()");
    }
    this.biquad.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.biquad.disconnect(target.getAudioNode());
  }

  dispose() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }
}

AutoTune.configTypes = {
  refreshInterval: "number"
};

export default AutoTune;
