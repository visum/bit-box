class AudioNode {
  constructor(options) {
    if (!options && !options.context) {
      throw new Error("options.context with AudioContext instance is required");
    }
    this.context = options.context;
  }
}