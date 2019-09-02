import Observable from "../lib/Observable.js";
import {frequencyTable, notesToNumbers} from "../lib/noteHelpers.js";

class NoteToFrequency extends Observable {
  constructor() {
    super();
    this.name = "NoteToFrequency";
    this.observed = new Map();

    this.eventHandlers = {
      play: event => {
        const noteNumber = notesToNumbers[event.note];
        const frequency = frequencyTable[noteNumber];

        this.notify({
          ...event,
          type: "startSound",
          frequency
        });
      },
      stop: event => {
        this.notify({ ...event, type: "stopSound" });
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

  subscribeTo(observable) {
    if (this.observed.has(observable)) {
      throw new Error(
        `NoteToFrequency is already observing ${observable.name}`
      );
    }
    const observer = observable.observe(this.handleEvent);
    this.observed.set(observable, observer);
  }

  unsubscribeFrom(observable) {
    if (this.observed.has(observable)) {
      const observer = this.observed.get(observable);
      observer.dispose();
      this.observed.delete(observable);
    }
  }
}

NoteToFrequency.respondsTo = {
  play: {
    description: "Start playing a note",
    params: {
      note: {
        type: "string",
        description: "the note name, like Ab3, to start playing"
      },
      id: {
        type: "number",
        description: "an arbitrary value that correlates the start/stop events"
      }
    }
  },
  stop: {
    description: "Stop playing the note with the matching id",
    params: {
      id: {
        type: "number"
      }
    }
  }
};

export default NoteToFrequency;
