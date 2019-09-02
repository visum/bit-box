import Observable from "../lib/Observable.js";
import { getNoteId } from "../lib/noteHelpers.js";

const keyCodeToNote = {
  87: "C#4", // "w"
  69: "Eb4", // "e"
  84: "F#4", // "t"
  89: "Ab4", // "y"
  85: "Bb4", // "u"
  79: "C#5", // "o"
  80: "D#5", // "p"

  65: "C4", // "a"
  83: "D4", // "s"
  68: "E4", // "d"
  70: "F4", // "f"
  71: "G4", // "g"
  72: "A4", // "h"
  74: "B4", // "j"
  75: "C5", // "k"
  76: "D5", // "l"
  186: "E5" // ";"
};

class KeyboardInput extends Observable {
  constructor() {
    super();
    this.name = "KeyboardInput";

    this.notesOn = {};

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    document.body.addEventListener("keydown", this.handleKeyDown);
    document.body.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(event) {
    const id = getNoteId();
    const note = keyCodeToNote[event.keyCode];
    if (note) {
      this.notesOn[note] = id;
      this.notify({ type: "play", note, id });
    }
  }

  handleKeyUp(event) {
    const note = keyCodeToNote[event.keyCode];
    if (note) {
      const id = this.notesOn[note];
      this.notify({ type: "stop", id });
    }
  }

  dispose() {
    document.body.removeEventListener("keydown", this.handleKeyDown);
    document.body.removeEventListener("keyup", this.handleKeyUp);
  }
}

export default KeyboardInput;
