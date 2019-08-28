import AudioNode from "./AudioNode.js";

class AudioDestination extends AudioNode {
  constructor(options) {
    super(options);
  }

  getAudioNode() {
    const {context} = this;
    return context.destination;
  }
}

export default AudioDestination;