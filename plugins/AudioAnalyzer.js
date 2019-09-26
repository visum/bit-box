import AudioNode from "./AudioNode.js";

class AudioAnalyzer extends AudioNode {
  constructor(options) {
    super(options);
    this.name="Analyzer";
    this._node = this.context.createAnalyser();
    this._buffer = null;
    this.fftSize = options.fftSize;
    this.smoothingTimeConstant = options.smoothingTimeConstant;
    this.minDb = options.minDb;
    this.maxDb = options.maxDb;

  }

  get fftSize() {
    return this._fftSize;
  }

  set fftSize(value) {
    const { _node } = this;
    _node.fftSize = value;
    this._buffer = new Uint8Array(_node.frequencyBinCount);
  }

  get buffer() {
    return this._buffer;
  }

  get bufferSize() {
    return this._node.frequencyBinCount;
  }

  updateTimeDomainData() {
    this._node.getByteTimeDomainData(this._buffer);
  }

  updateFrequencyDomainData() {
    this._node.getByteFrequencyData(this._buffer);
  }

  getAudioNode() {
    return this._node;
  }
}

AudioAnalyzer.configTypes = {
  fftSize: "number",
  smoothingTimeConstant: "number",
  minDb: "number",
  maxDb: "number",
  mode: "string"
};

AudioAnalyzer.stageComponent = "bb-analyzer-node";

export default AudioAnalyzer;