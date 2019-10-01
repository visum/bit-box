import AudioNode from "./AudioNode.js";

const IMPULSE_ROOT = "./assets/impulseResponses/";

class Reverb extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "Reverb";
    this.node = options.context.createConvolver();
    
    this.response = options.response;
  }

  set response(newValue) {
    this._response = newValue;
    fetch(IMPULSE_ROOT + newValue).then(response => response.arrayBuffer()).then(arrayBuffer => {
      this.context.decodeAudioData(arrayBuffer, (buffer) => {
        this.node.buffer = buffer;
      });
    });
  }

  get response() {
    return this._response;
  }

  getAudioNode() {
    return this.node;
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error("Connect target of Reverb does not implement getAudioNode()");
    }
    this.node.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.node.disconnect(target.getAudioNode());
  }
}

Reverb.configTypes = {
  response: "string"
};

export default Reverb;
