import EventTarget from "../lib/EventTarget.js";
import { notesToNumbers } from "../lib/noteHelpers.js";

const start = 0x90;

class MIDIOutput {
  constructor(options) {
    EventTarget.apply(this);
    this.name = "MIDIOutput";
    this.access = null;
    this.options = options;
    this.channel = options.channel;
    this.playing = {};
    this.outputs = [];
    
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(access => {
        this.access = access;
        access.addEventListener('statechange', () => {
          // listen to any added I/O
        });
      });
    } else {
      console.error("MIDI is not supported in this browser");
    }

    this.handleEvent = this.handleEvent.bind(this);

    this.eventHandlers = {
      "play": (event) => {
        const noteNumber = notesToNumbers[event.note];
        const command = start + this.channel - 1; 
        this.send(command, noteNumber, 100);
        this.playing[event.id] = noteNumber;
      },
      "stop": (event) => {
        const noteNumber = this.playing[event.id];
        const command = start + this.channel - 1;
        this.send(command, noteNumber, 0);
        this.playing[event.id] = null;
      }
    };

  }

  handleEvent(event) {
    if (this.eventHandlers[event.type]) {
      this.eventHandlers[event.type](event);
    }
  }

  send(command, note, velocity) {
    const outputs = this.access.outputs.values();
    for(const output of outputs) {
      output.send([command, note, velocity]);
    }
  }
}

MIDIOutput.configTypes = {
  channel: "number"
};

export default MIDIOutput;