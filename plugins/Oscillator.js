import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";

class Oscillator extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "Oscillator";
    this.waveType = options.waveType;
    this.attack = options.attack;
    this.decay = options.decay;

    EventTarget.apply(this);

    this.oscillators = {};
    this.gains = {};
    this.target = null;

    this.eventHandlers = {
      startSound: ({ frequency, id }) => {
        this.start(frequency, id);
      },
      stopSound: ({ id }) => {
        this.stop(id);
      }
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error(
        "Connect target of Oscillator does not implement getAudioNode"
      );
    }
    this.target = target;
  }

  disconnect() {
    this.target = null;
  }

  start(frequency, id) {
    if (!this.target) {
      throw new Error(
        "Oscillator can't start before it is connected to an AudioTarget"
      );
    }

    const { context, oscillators, gains, target, waveType, attack } = this;
    if (this.oscillators[id]) {
      this.stop(id);
    }

    const gain = context.createGain();
    gain.gain.setValueAtTime(0, context.currentTime);

    const oscillator = context.createOscillator();
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(gain);
    gain.connect(target.getAudioNode());
    oscillator.start();
    gain.gain.linearRampToValueAtTime(1, context.currentTime + attack);

    oscillators[id] = oscillator;
    gains[id] = gain;
  }

  stop(id) {
    const {target, oscillators, gains, decay, context} = this;
    const oscillator = oscillators[id];
    const gain = gains[id];
    if (oscillator) {
      gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + decay);
      setTimeout(() => {
        oscillator.stop();
        gain.disconnect(target.getAudioNode());
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

Oscillator.configTypes = {
  waveType: "string",
  attack: "number",
  decay: "number"
};

Oscillator.respondsTo = {
  startSound: {
    params: {
      frequency: {
        type: "number"
      },
      id: {
        type: "number",
        description:
          "An arbitrary value used to correlate a sound across start/stop events."
      }
    },
    description: "Start making a noise"
  },
  stopSound: {
    description: "Stop making noise",
    params: {
      id: {
        type: "number"
      }
    }
  }
};

export default Oscillator;
