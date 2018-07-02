const keyCodeToNote = {
  81: "B3", // "q"
  65: "C4", // "a"
  83: "D4", // "s"
  87: "C#4", // "w"
  68: "E4", // "d"
  69: "Eb4", // "e"
  70: "F4", // "f",
  71: "G4" // "g"
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