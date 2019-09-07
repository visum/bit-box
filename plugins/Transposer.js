import Observable from "../lib/Observable.js";
import EventTarget from "../lib/EventTarget.js";
import {
  notesToNumbers,
  numbersToNotes,
  getNoteId
} from "../lib/noteHelpers.js";

class Transposer extends Observable {
  constructor(config) {
    super();
    this.name = "Transposer";
    this.factor = config.factor;

    EventTarget.apply(this);

    const notesPlaying = {};

    this.eventHandlers = {
      play: ({ note, id, ...event }) => {
        const newNote = numbersToNotes[notesToNumbers[note] + 3];
        const newId = getNoteId();
        notesPlaying[id] = newId;
        this.notify({ ...event, note: newNote, id: newId });
      },
      stop: ({ id, ...event }) => {
        const newId = notesPlaying[id];
        this.notify({ id: newId, ...event });
        notesPlaying[id] = null;
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

Transposer.respondsTo = {
  play: {
    description:
      "Start playing a transposed note. The transposed note will have a new note id.",
    params: {
      note: {
        type: "string",
        description: "The note name, like Ab3, to start playing"
      },
      id: {
        type: "number",
        description:
          "A value that permits stopping this note in the future. Transposer will generate a new note id to pass on."
      }
    }
  },
  stop: {
    description: "Stop playing the transposed note with the matching id",
    params: {
      id: {
        type: "number"
      }
    }
  }
};

export default Transposer;
