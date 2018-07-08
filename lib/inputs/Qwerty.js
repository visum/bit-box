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
  186: "E5", // ";"

  90: "C3", // "z"
  88: "D3", // "x"
  67: "E3", // "c",
  86: "F3", // "v",
  66: "G3", // "b",
  78: "A3", // "n",
  77: "B3", // "m",
  188: "C4", // ",",
  190: "D4" // "."
};


export default class QwertyInput {
  constructor(global) {
    if (!global.document) {
      global = window;
    }

    this.trackNumber = null;
    this.target = null;
    this.keysDown = {};

    global.document.addEventListener("keydown", event => {
      const note = keyCodeToNote[event.keyCode];
      // ignore repeat events
      if (note && !this.keysDown[event.keyCode]) {
        this.keysDown[event.keyCode] = true;
        this.dispatch({ type: "noteOn", velocity: 127, note: note });
      }
    });

    global.document.addEventListener("keyup", event => {
      const note = keyCodeToNote[event.keyCode];
      if (this.keysDown[event.keyCode]) {
        this.keysDown[event.keyCode] = false;
        this.dispatch({ type: "noteOff", note: note });
      }
    });
  }

  dispatch(event) {
    const { target } = this;
    if (target) {
      target.notify(event);
    }
  }

  connect(target) {
    this.target = target;
    return target;
  }
}
