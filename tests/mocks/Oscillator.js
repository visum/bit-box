import AudioParam from "./AudioParam.js";

export default class Oscillator {
  constructor() {
    this.state = "new";

    this.states = {
      new: {
        start: () => {
          this.state = "running";
        },
        stop: () => {
          console.error("Oscillator can't stop, it's not running yet.");
        }
      },
      running: {
        start: () => {
          console.error("Oscillator can't start, it's already running.");
        },
        stop: () => {
          this.state = "stopped";
        }
      },
      stopped: {
        start: () => {
          console.error("Can't restart a stopped oscillator");
        },
        stop: () => {
          console.error("Can't stop a stopped osciallator");
        }
      }
    };

    this.frequency = new AudioParam();
  }

  start() {
    this.states[this.state].start();
  }

  stop() {
    this.states[this.state].stop();
  }

  connect() {}

  disconnect() {}
}
