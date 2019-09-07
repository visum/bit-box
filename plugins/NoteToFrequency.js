import Observable from "../lib/Observable.js";
import {frequencyTable, notesToNumbers} from "../lib/noteHelpers.js";
import EventTarget from "../lib/EventTarget.js";

class NoteToFrequency extends Observable {
  constructor() {
    super();
    this.name = "NoteToFrequency";

    EventTarget.apply(this);

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
