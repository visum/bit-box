export default class AudioNode {
  constructor(options) {
    if (!options && !options.context) {
      throw new Error("AudioNode requires audio context");
    }

    this.context = options.context;
    this.audioNode = null;
  }

  getAudioNode() {
    return this.audioNode;
  }

  connect(target) {
    this.audioNode.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.audioNode.disconnect(target.getAudioNode());
  }
}