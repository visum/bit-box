import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";

class SineGenerator extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "SineGenerator";

    EventTarget.apply(this);

    this.oscillators = {};
    this.target = null;

    this.eventHandlers = {
      startSound: event => {
        this.start(event.frequency, event.id);
      },
      stopSound: event => {
        this.stop(event.id);
      }
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error(
        "Connection target of SineGenerator does not implement `getAudioNode`"
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
        "SineGenerator can't start before it is connected to an AudioTarget"
      );
    }

    const { context } = this;
    if (this.oscillators[id]) {
      this.stop(id);
    }

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(this.target.getAudioNode());
    oscillator.start();
    this.oscillators[id] = oscillator;
  }

  stop(id) {
    const { target, oscillators  } = this;
    const oscillator = oscillators[id];
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect(target.getAudioNode());
    }
    
    oscillators[id] = null;
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }

}

SineGenerator.respondsTo = {
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

export default SineGenerator;
