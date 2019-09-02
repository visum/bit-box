import AudioNode from "./AudioNode.js";

export default class Gain extends AudioNode{
  constructor(options) {
    super(options);
    const gainValue = options.value || 0.8;
    
    this.gainNode = this.context.createGain();
    this.gainNode.gain.setValueAtTime(gainValue, this.context.currentTime);

  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error("Connection target of Gain does not implement getAudioNode()");
    }

    this.target = target;
    this.gainNode.connect(target.getAudioNode());
  }

  disconnect() {
    this.gainNode.disconnect(this.target.getAudioNode());
    this.target = null;
  }

  getAudioNode() {
    return this.gainNode;
  }


}