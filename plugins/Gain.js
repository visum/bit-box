import AudioNode from "./AudioNode.js";

class Gain extends AudioNode{
  constructor(options) {
    super(options);
    this.name="Gain";
    const gainValue = options.value || 0.8;
    
    this.gainNode = this.context.createGain();
    this.gainNode.gain.setValueAtTime(gainValue, this.context.currentTime);
  }

  set value(newValue) {
    this.gainNode.gain.setValueAtTime(newValue, this.context.currentTime);
  }

  get value() {
    return this.gainNode.gain.value;
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

Gain.configTypes = {
  value: "number"
};

export default Gain;