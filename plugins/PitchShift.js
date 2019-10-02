import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";

class PitchShift extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "PitchShift";

    EventTarget.apply(this);

    this.node = this.context.createBiquadFilter();

    this.node.type = "highpass";

    this.eventHandlers = {
      startShift: ({delta}) => {
        this.node.detune.setValueAtTime(delta * 100, this.context.currentTime);
      },
      stopShift: () => {
        this.node.detune.setValueAtTime(0, this.context.currentTime);
      }
    }
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }
}

PitchShift.configTypes = {};

export default PitchShift;
