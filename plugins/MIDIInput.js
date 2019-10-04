import Observable from "../lib/Observable.js";
import { getNoteId, numbersToNotes } from "../lib/noteHelpers.js";

class MIDIInput extends Observable {
  constructor(options) {
    super();
    this.name = "MIDIInput";
    this.access = null;
    this.options = options;
    this.playing = {};
    this.channel = options.channel;

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(access => {
        for (const input of access.inputs.values()) {
          input.onmidimessage = e => this.handleMIDIMessage(e);
        }
        this.access = access;

        access.onstatechange = function(event) {
          // listen to any added I/O
        };
      });
    } else {
      console.error("MIDI is not supported in this browser");
    }
  }

  handleMIDIMessage(event) {
    const data = event.data;
    const command = data[0];
    const note = numbersToNotes[data[1]];
    const velocity = data[2];
    if (command === 0x90) {
      if (velocity !== 0) {
        // channel 1 on
        const id = getNoteId();
        this.playing[note] = id; // the playing key should combine the channel and note
        this.notify({ type: "play", note, id });
      } else {
        const id = this.playing[note];
        if (id) {
          this.notify({ type: "stop", id });
          this.playing[note] = null;
        }
      }
    }
  }
}

MIDIInput.configTypes = {
  channel: "number"
};

export default MIDIInput;
