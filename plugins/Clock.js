import Observable from "../Observable.js";

class Clock extends Observable {
  constructor(options) {
    super();
    this.beatsPerMeasure = options.beatsPerMeasure;
    this.beatsPerSecond = options.beatsPerSecond;

    this.running = false;
  }

  tick() {

  }

  start() {

  }

  stop() {

  }
}

Clock.configTypes = {
  beatsPerMeasure: "number",
  beatsPerSecond: "number"
};

export default Clock;
