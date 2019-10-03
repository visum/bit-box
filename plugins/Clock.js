import Observable from "../lib/Observable.js";

class Clock extends Observable {
  constructor(options) {
    super();
    this.name = "Clock";
    this._beatsPerMinute = null;
    this._ticksPerBeat = null;
    this._intervalId = null;
    this._intervalTime = null;

    this.beatsPerMinute = options.beatsPerMinute;
    this.ticksPerBeat = options.ticksPerBeat;

    this.beatsPerMeasure = options.beatsPerMeasure;

    this.running = false;

    this.ticks = 0;
  }

  set beatsPerMinute(newValue) {
    this._beatsPerMinute = newValue;
    this.calculateInterval();
    this.running && this.start();
  }

  get beatsPerMinute() {
    return this._beatsPerMinute;
  }

  set ticksPerBeat(newValue) {
    this._ticksPerBeat = newValue;
    this.calculateInterval();
    this.running && this.start();
  }

  get ticksPerBeat() {
    return this._ticksPerBeat;
  }

  getState() {
    const tick = this.ticks;
    const tickInBeat = (this.ticks % this._ticksPerBeat) + 1;
    const beat = Math.floor(this.ticks / this._ticksPerBeat);
    const beatInMeasure = (beat % this.beatsPerMeasure) + 1;
    const measure = Math.floor(beat / this.beatsPerMeasure) + 1;
    return {tickInBeat, beat, beatInMeasure, measure, tick};
  }

  calculateInterval() {
    const beatsPerSecond = this._beatsPerMinute / 60;
    const ticksPerSecond = beatsPerSecond * this._ticksPerBeat;
    this._intervalTime = (1/ticksPerSecond) * 1000;
  }

  tick() {
    this.ticks++;
    this.notify({type: "clock", subType: "tick", ...this.getState()});
  }

  start() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._intervalId = setInterval(() => {
      this.tick();
    }, this._intervalTime);
    this.notify({type: "clock", subType: "start"});
    this.running = true;
  }

  pause() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this.notify({type: "clock", subType: "pause"});
      this.running = false;
    }
  }

  reset() {
    this.ticks = 0;
    this.notify({type: "clock", subType: "reset"});
  }
}

Clock.configTypes = {
  beatsPerMeasure: "number",
  beatsPerMinute: "number",
  ticksPerBeat: "number"
};

Clock.stageComponent = "bb-clock";

export default Clock;
