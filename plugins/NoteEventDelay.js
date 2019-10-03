import Observable from "../lib/Observable.js";
import EventTarget from "../lib/EventTarget.js";
import { getNoteId } from "../lib/noteHelpers.js";

class NoteEventDelay extends Observable {
  constructor(options) {
    super();
    this.name = "NoteEventDelay";
    EventTarget.apply(this);

    this.playing = {};
    this.time = options.time;

    this.eventHandlers = {
      play: event => {
        const newNoteId = getNoteId();
        this.playing[event.id] = newNoteId;
        const forwardEvent = { ...event, id: newNoteId };
        setTimeout(() => {
          this.notify(forwardEvent);
        }, this.time * 1000);
      },
      stop: event => {
        const newNoteId = this.playing[event.id];
        if (newNoteId) {
          this.playing[event.id] = null;
          const forwardEvent = { ...event, id: newNoteId };
          setTimeout(() => {
            this.notify(forwardEvent);
          }, this.time * 1000);
        }
      },
      slide: event => {
        const newNoteId = this.playing[event.id];
        if (newNoteId) {
          const forwardEvent = {...event, id: newNoteId};
          setTimeout(() => {
            this.notify(forwardEvent);
          }, this.time * 1000);
        }
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

NoteEventDelay.configTypes = {
  time: "number"
};

export default NoteEventDelay;
