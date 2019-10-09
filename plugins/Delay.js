import AudioNode from "./AudioNode.js";

class Delay extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "Delay";
    this._time = 0;
    this.delayNode = this.context.createDelay(20);
    this.time = options.time;
  }

  set time(value) {
    const {delayNode} = this;
    this._time = value;
    delayNode.delayTime.setValueAtTime(delayNode.delayTime.value, this.context.currentTime);
    delayNode.delayTime.setValueAtTime(value, this.context.currentTime);
  }

  get time() {
    return this._time;
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error(
        "Connect target of Oscillator does not implement getAudioNode"
      );
    }
    this.delayNode.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.delayNode.disconnect(target.getAudioNode());
  }

  getAudioNode() {
    return this.delayNode;
  }
  
}

Delay.configTypes = {
  time: "number"
};

export default Delay;