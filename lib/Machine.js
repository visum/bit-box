import Clock from "./Clock.js";
import ComponentFactory from "./ComponentFactory.js";

export default class Machine {
  constructor(global) {
    const AudioContext = global.AudioContext || global.webkitAudioContext;

    const context = new AudioContext();
    const gain = context.createGain();

    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.7, context.currentTime);

    this.componentFactory = new ComponentFactory(context, gain);
    this.context = context;
    this.destination = context.destination;
    this.audioOutput = gain;
    this.sources = [];
  }

  setVolume(newValue) {
    const { audioOutput, context } = this;
    audioOutput.gain.setValueAtTime(newValue, context.currentTime);
  }

  panic() {
    const { tracks } = this;
    for (let i in tracks) {
      const track = tracks[i];
      if (track) {
        track.panic();
      }
    }
  }

  loadSetup(setup) {
    const { componentFactory } = this;
    setup.eventTrees.forEach(function(tree) {
      componentFactory.create(tree);
    });
  }
}
