import AudioNode from "./AudioNode.js";

export default class SimpleGain extends AudioNode{
  constructor(options) {
    super(options);
    this.audioNode = this.context.createGain();

    this.audioNode.gain.setValueAtTime(options.level, this.context.currentTime);
  }

  setLevel(newLevel) {
    this.audioNode.gain.setValueAtTime(newLevel, this.context.currentTime);
  }
}