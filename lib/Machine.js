import Clock from "./Clock.js";
import ComponentFactory from "./ComponentFactory.js";

export default class Machine {
  constructor(global) {
    const AudioContext = global.AudioContext || global.webkitAudioContext;

    const context = new AudioContext();

    this.componentFactory = new ComponentFactory(context);
    this.context = context;
    this.destination = context.destination;
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
    componentFactory.loadSetup(setup);
  }
}
