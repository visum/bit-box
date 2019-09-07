class AudioNode {
  constructor(options) {
    if (!options && !options.context) {
      throw new Error("options.context with AudioContext instance is required");
    }
    this.options = options;
    this.context = options.context;
  }
}

export default AudioNode;