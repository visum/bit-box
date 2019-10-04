import AudioNode from "./AudioNode.js";

class AudioInput extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "AudioInput";

    this.gainNode = this.context.createGain();
    this.gain = options.gain;

    if (!navigator.mediaDevices) {
      console.error("mediaDevices not supported");
      return;
    }
    this.nodePromise = navigator.mediaDevices.getUserMedia({audio:true, video: false}).then((stream) => {
      const input = this.context.createMediaStreamSource(stream);
      input.connect(this.gainNode);
    });
    
  }

  set gain(value) {
    this.gainNode.gain.setValueAtTime(value, this.context.currentTime);
  }

  get gain() {
    return this.gainNode.gain.value;
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      console.error("AudioInput connection target does not implement getAudioNode()");
    }
    this.gainNode.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.gainNode.disconnect(target.getAudioNode());
  }


}

AudioInput.configTypes = {
  gain: "number"
};

export default AudioInput;