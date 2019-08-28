import Observable from "../lib/Observable.js";

const keyCodeToNote = {
  87: "C#4", // "w"
  69: "Eb4", // "e"
  84: "F#4", // "t"
  89: "Ab4", // "y"
  85: "Bb4", // "u"
  79: "C#5", // "o"
  80: "D#5", // "p"

  65: "C4",  // "a"
  83: "D4",  // "s"
  68: "E4",  // "d"
  70: "F4",  // "f"
  71: "G4",  // "g"
  72: "A4",  // "h"
  74: "B4",  // "j"
  75: "C5",  // "k"
  76: "D5",  // "l"
  186: "E5"  // ";"
};

let noteId = 0;
const getNoteId = () => {
  if (noteId > 2000) {
    noteId = 0;
  }
  return noteId++;
};

class KeyboardInput extends Observable {
  constructor() {
    super();
    this.name = "KeyboardInput";

    this.notesOn = {};

    document.body.addEventListener("keydown", event => this.handleKeyDown(event));
    document.body.addEventListener("keyup", event =>  this.handleKeyUp(event));
  }

  handleKeyDown(event) {
    const id = getNoteId();
    const note = keyCodeToNote[event.keyCode];
    this.notesOn[note] = id;
    this.notify({type: "play", note, id});
  }

  handleKeyUp(event) {
    const note = keyCodeToNote[event.keyCode];
    const id = this.notesOn[note];
    this.notify({type: "stop", id});
  }

  dispose() {
    document.body.removeEventListener("keydown", this.handleKeyDown);
    document.body.removeEventListener("keyup", this.handleKeyUp);
  }

}

export default KeyboardInput;
