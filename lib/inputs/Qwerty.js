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

export default class QwertyInput {
  constructor(global) {
    if (!global.document) {
      console.error("Global object doesn't have a document to listen for keyboard events on");
    }

    this.trackNumber = null;
    this.machine = null;
    this.keysDown = {};

    global.document.addEventListener("keydown", (event) => {
      const note = keyCodeToNote[event.keyCode];
      // ignore repeat events
      if (note && !this.keysDown[event.keyCode]) {
        this.keysDown[event.keyCode] = true;
        this.machine.noteOn(note, this.trackNumber, 0.8);
      }
    });

    global.document.addEventListener("keyup", (event) => {
      const note = keyCodeToNote[event.keyCode];
      if (this.keysDown[event.keyCode]) {
        this.machine.noteOff(note, this.trackNumber);
        this.keysDown[event.keyCode] = false;
      }
    });
  }

  attach(machine, trackNumber) {
    this.machine = machine;
    this.trackNumber = trackNumber;
  }
}