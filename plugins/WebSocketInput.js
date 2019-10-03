import Observable from "../lib/Observable.js";
import {
  getNoteId,
  numbersToNotes,
  notesToNumbers
} from "../lib/noteHelpers.js";

class WebSocketInput extends Observable {
  constructor(options) {
    super();
    this.name = "WebSocketInput";
    if (!options.host) {
      console.error("I need a host to connect to");
    }
    this.socket = null;

    this.host = options.host;

    this.currentNoteId = 0;

    this.playing = {};
  }

  set host(value) {
    if (this.socket) {
      this.socket.close();
    }
    this._host = value;
    const socket = new WebSocket(value, "receiver-protocol");

    socket.addEventListener("error", event => {
      console.log(event);
    });

    socket.addEventListener("message", event => {
      const data = JSON.parse(event.data);
      if (data.type === "play") {
        const noteId = getNoteId();
        this.playing[data.clientId] = noteId;
        this.notify({
          type: "play",
          note: numbersToNotes[data.noteNumber],
          id: noteId
        });
      } else if (data.type === "slide") {
        const noteId = this.playing[data.clientId];
        data.note = numbersToNotes[data.noteNumber];
        data.id = noteId;
        data.time = 0.1;
        this.notify(data);
      } else if (data.type === "stop") {
        data.id = this.playing[data.clientId];
        this.playing[data.clientId] = null;
        this.notify(data);
      }
    });

    this.socket = socket;
  }

  get host() {
    return this._host;
  }
}

WebSocketInput.configTypes = {
  host: "string"
};

export default WebSocketInput;
