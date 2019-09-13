import AudioNode from "./AudioNode.js";

class AudioDestination extends AudioNode {
  constructor(options) {
    super(options);
    this.name="Destination";
  }

  getAudioNode() {
    const {context} = this;
    return context.destination;
  }
}

export default AudioDestination;
