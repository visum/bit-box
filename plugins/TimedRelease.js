import Observable from "../lib/Observable.js";
import EventTarget from "../lib/EventTarget.js";

class TimedRelease extends Observable {
  constructor(options) {
    super(options);
    this.name = "TimedRelease";
    this.time = options.time;
    EventTarget.apply(this);

    this.eventHandlers = {
      play: event => {
        this.notify(event);
        setTimeout(() => {
          this.notify({ type: "stop", id: event.id });
        }, this.time * 1000);
      }
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }
}

TimedRelease.configTypes = {
  time: "number"
};

export default TimedRelease;
