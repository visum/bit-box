import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";

class PeriodicWave extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "PeriodicWave";
    this._waveTablePath = options.waveTablePath;
    this.attack = options.attack;
    this.decay = options.decay;

    EventTarget.apply(this);

    this.periodicWave = this.context.createPeriodicWave(Float32Array.from([0, 1]), Float32Array.from([0, 0]));

    this.oscillators = {};
    this.gains = {};
    this.targets = new Map();

    this.eventHandlers = {
      startSound: ({ frequency, id }) => {
        this.start(frequency, id);
      },
      stopSound: ({ id }) => {
        this.stop(id);
      }
    };

    if (this.waveTablePath) {
      this.loadWaveTable(this._waveTablePath);
    }

    this.handleEvent = this.handleEvent.bind(this);
  }

  get waveTablePath() {
    return this._waveTablePath;
  }

  set waveTablePath(value) {
    this._waveTablePath = value;
    this.loadWaveTable(value);
  }

  async loadWaveTable(path) {
    const table = (await import(path)).default;
    this.periodicWave = this.context.createPeriodicWave(Float32Array.from(table.real), Float32Array.from(table.imag));
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error(
        "Connect target of PeriodicWave does not implement getAudioNode()"
      );
    }
    this.targets.set(target, target.getAudioNode());
  }

  disconnect(target) {
    this.targets.delete(target);
  }

  start(frequency, id) {
    if (this.targets.size === 0) {
      throw new Error(
        "PeriodicWave can't start before it is connected to an AudioTarget"
      );
    }

    const { context } = this;
    if (this.oscillators[id]) {
      this.stop(id);
    }

    const gain = context.createGain();

    gain.gain.setValueAtTime(0, context.currentTime);

    const oscillator = context.createOscillator();
    oscillator.setPeriodicWave(this.periodicWave);
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    oscillator.connect(gain);
    this.targets.forEach(targetNode => gain.connect(targetNode));
    oscillator.start();
    gain.gain.linearRampToValueAtTime(1, context.currentTime + this.attack);

    this.gains[id] = gain;
    this.oscillators[id] = oscillator;
  }

  stop(id) {
    const { target, oscillators, gains, context, decay } = this;
    const oscillator = oscillators[id];
    const gain = gains[id];

    if (oscillator) {
      gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + decay);
      setTimeout(() => {
        oscillator.stop();
        this.targets.forEach(targetNode => gain.disconnect(targetNode));
      }, decay * 1000);
    }

    oscillators[id] = null;
    gains[id] = null;
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }
}

PeriodicWave.configTypes = {
  waveTablePath: "string",
  attack: "number",
  decay: "number"
};

export default PeriodicWave;
