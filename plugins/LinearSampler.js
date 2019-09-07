import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";
import { notesToNumbers } from "../lib/noteHelpers.js";

export default class LinearSampler extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "LinearSampler";
    EventTarget.apply(this);

    this.load();

    this.target = null;
    this.players = {};
    this.buffer = null;

    this.eventHandlers = {
      play: ({ note, id }) => {
        this.start(note, id);
      },
      stop: ({ id }) => {
        this.stop(id);
      }
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  async load() {
    const { filePath, context } = this.options;
    const audioData = await (await fetch(filePath)).arrayBuffer();
    context.decodeAudioData(audioData, buffer => {
      this.buffer = buffer;
    });
  }

  start(note, id) {
    const { context, buffer, options: {bottomNote, topNote, offset, loop, advance}, target } = this;
    if (!target) {
      console.error("LinearSampler can't play before it is connected to a source");
      return;
    }
    if (!buffer) {
      return;
    }

    const noteNumber = notesToNumbers[note];
    const bottomNoteNumber = notesToNumbers[bottomNote];
    const topNoteNumber = notesToNumbers[topNote];

    if (noteNumber > topNoteNumber) {
      return;
    }

    const noteOffset = ((noteNumber - bottomNoteNumber) * offset) + advance;
    
    const player = context.createBufferSource();
    player.buffer = buffer;
    player.connect(target.getAudioNode());
    if (loop) {
      player.loop = true;
      player.loopStart = noteOffset;
      player.loopEnd = noteOffset + offset;
      player.start(0, noteOffset);
    } else {
      player.start(0, noteOffset, offset);
    }

    this.players[id] = player;
  }

  stop(id) {
    const player = this.players[id];
    if (player) {
      try {
        player.stop();
        player.disconnect();
      } catch (e) {}
    }
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }

  connect(target) {
    if (typeof target.getAudioNode !== "function") {
      throw new Error("Connect target of LinearSampler does not implement getAudioNode");
    }
    this.target = target;
  }

  disconnect() {
    this.target = null;
  }
}
