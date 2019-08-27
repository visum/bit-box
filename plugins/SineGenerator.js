import AudioNode from "./AudioNode.js";

class SineGenerator extends AudioNode {
  constructor(options) {
    super(options);

    this.observers = [];
    this.observed = new Map();
    this.oscillator = null;
    this.target = null;

    this.start.bind(this);
    this.stop.bind(this);
    this.connectTo.bind(this);
    this.disconnect.bind(this);
    this.handleEvent.bind(this);
    this.connect.bind(this);

    this.eventHandlers = {
      "startSound": (event) => {
        this.start(event.frequency);
      },
      "stopSound": () => {
        this.stop();
      }
    };
  }

  connect(target) {
    if(typeof target.getAudioNode !== "function") {
      throw new Error("Connection target of SineGenerator does not implement `getAudioNode`");
    }
    this.target = target;
  }

  disconnect() {
    this.target = null;
  }

  start(frequency) {
    if (!this.target) {
      throw new Error("SineGenerator can't start before it is connected to an AudioTarget");
    }

    const {context} = this;
    if (this.oscillator) {
      this.stop();
    }
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(this.target.getAudioNode());
    oscillator.start();
  }

  stop() {
    const {target, oscillator} = this;
    oscillator.stop();
    oscillator.disconnect(target.getAudioNode());
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }

  subscribeTo(observable) {
    if (this.observed.has(observable)) {
      throw new Error(`SineGenerator already observing ${observable.name}`);
    }
    const observer = observable.observe(this.handleEvent);
    this.observed.set(observable, observer);
    
  }

  unscribeFrom(observable) {
    if (this.observed.has(observable)) {
      const observer = this.observed.get(observable);
      observer.dispose();
      this.observed.delete(observable);
    }
  }
}

SineGenerator.respondsTo = {
  "startSound": {
    params: [
      {"frequency": "number"}
    ],
    description: "Start making a noise"
  },
  "stopSound": {
    description: "Stop making noise"
  }
};

export default SineGenerator;
