import AudioNode from "./AudioNode.js";

class AudioAnalyzer extends AudioNode {
  constructor(options) {
    super(options);
    this.name="Analyzer";
    this._node = this.context.createAnalyser();
    this._node.minDecibels = -90;
    this._node.maxDecibels = -10;
    this._node.fftSize = 2048;
    this._buffer = new Uint8Array(this._node.frequencyBinCount);
    this._mode = options.mode;
  }

  get buffer() {
    return this._buffer;
  }

  get bufferSize() {
    return this._node.frequencyBinCount;
  }

  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
  }

  get smoothingTimeConstant() {
    return this._node.smoothingTimeConstant;
  }

  set smoothingTimeConstant(value) {
    this._node.smoothingTimeConstant = value;
  }

  updateTimeDomainData() {
    this._node.getByteTimeDomainData(this._buffer);
  }

  updateFrequencyDomainData() {
    this._node.getByteFrequencyData(this._buffer);
  }

  updateBuffer() {
    if (this._mode === "time") {
      return this.updateTimeDomainData();
    } else {
      return this.updateFrequencyDomainData();
    }
  }

  getAudioNode() {
    return this._node;
  }
}

AudioAnalyzer.configTypes = {
  smoothingTimeConstant: "number"
};

AudioAnalyzer.stageComponent = "bb-analyzer-node";

export default AudioAnalyzer;