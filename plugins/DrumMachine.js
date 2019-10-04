import EventTarget from "../lib/EventTarget.js";
import AudioNode from "./AudioNode.js";

const sounds = {
  snare: "./assets/snare.mp3",
  hiHat: "./assets/hiHat.mp3",
  bass: "./assets/bass.mp3",
  pop: "./assets/pop.mp3"
};

class DrumMachine extends AudioNode {
  constructor(options) {
    super(options);
    EventTarget.apply(this);
    this.name = "DrumMachine";

    this.buffers = {};
    this.gainNode = this.context.createGain();

    this.gain = options.gain;

    this.handleEvent = this.handleEvent.bind(this);

    this.loadSamples();
  }

  set gain(value) {
    this.gainNode.gain.setValueAtTime(value, this.context.currentTime);
  }

  get gain() {
    return this.gainNode.gain.value;
  }

  loadSamples() {
    const { context, buffers } = this;
    Object.entries(sounds).forEach(async ([key, path]) => {
      const audioData = await (await fetch(path)).arrayBuffer();
      context.decodeAudioData(audioData, buffer => {
        buffers[key] = buffer;
      });
    });
  }

  handleEvent(event) {
    if (event.type === "drum") {
      this.play(event.subType);
    }
  }

  play(type) {
    if (this.buffers[type]) {
      const player = this.context.createBufferSource();
      player.buffer = this.buffers[type];
      player.connect(this.gainNode);
      player.start();
    }
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error(
        "Connect target of DrumMachine does not implement getAudioNode()"
      );
    }
    this.gainNode.connect(target.getAudioNode());
  }

  disconnect(target) {
    this.gainNode.disconnect(target.getAudioNode());
  }
}

DrumMachine.configTypes = {
  gain: "number"
};

export default DrumMachine;
