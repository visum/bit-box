import AudioNode from "./AudioNode.js";

class StereoPanner extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "StereoPanner";
    this.node = this.context.createStereoPanner();

    this._pan = null;
    this.pan = options.pan;
  }

  set pan(value) {
    this.node.pan.setValueAtTime(value, this.context.currentTime);
  }

  get pan() {
    return this.node.pan.value;
  }

  getAudioNode() {
    return this.node;
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error("connection target of StereoPanner does not implement getAudioNode()");
    }
    this.node.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.node.disconnect(target.getAudioNode());
  }
}

StereoPanner.configTypes = {
  pan: "number"
}

export default StereoPanner;
