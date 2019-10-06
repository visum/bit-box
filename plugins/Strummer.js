import { getNoteId } from "../lib/noteHelpers.js";
import Observable from "../lib/Observable.js";
import EventTarget from "../lib/EventTarget.js";

class Strummer extends Observable {
  constructor(options) {
    super(options);
    this.name = "Strummer";
    this.noteDelayMs = options.noteDelayMs;
    this.noteDurationMs = options.noteDurationMs;
    EventTarget.apply(this);

    this.handleEvent = this.handleEvent.bind(this);

  }

  handleEvent(event) {
    if (event.type === "strum") {

      const notes = event.notes;
      let noteIndex = 0;
      this.playNote(notes[noteIndex]);
      noteIndex += 1;
      const strumInterval = setInterval(() => {
        const note = notes[noteIndex];
        if (note) {
          this.playNote(note);
          noteIndex += 1;
        }
        else {
          clearInterval(strumInterval);
        }
      }, this.noteDelayMs);
    }
  }

  playNote(note) {
    let id = getNoteId();
    this.notify({type: "play", note, id});
    setTimeout(() => {
      this.notify({type: "stop", id});
    }, this.noteDurationMs);
  }

}

Strummer.configTypes = {
  noteDelayMs: "number",
  noteDurationMs: "number"
};

export default Strummer;