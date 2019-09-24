import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";
import { notesToNumbers } from "../lib/noteHelpers.js";

class LinearSampler extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "LinearSampler";
    EventTarget.apply(this);

    this.load();

    this.target = null;
    this.players = {};
    this.buffer = null;
    this.bottomNote = options.bottomNote;
    this.topNote = options.topNote;
    this.offset = options.offset;
    this.loop = options.loop;
    this.advance = options.advance;
    this.filePath = options.filePath;

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
    const { context, buffer, bottomNote, topNote, offset, loop, advance, target } = this;
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
    
    const bufferSource = context.createBufferSource();
    const gainNode = context.createGain();
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    gainNode.connect(this.target.getAudioNode());
    if (loop) {
      bufferSource.loop = true;
      bufferSource.loopStart = noteOffset;
      bufferSource.loopEnd = noteOffset + offset;
      bufferSource.start(0, noteOffset);
    } else {
      bufferSource.start(0, noteOffset, offset);
    }

    this.players[id] = {gainNode, bufferSource};
  }

  async stop(id) {
    const player = this.players[id];
    if (player) {
      try {
        await this.downRamp(player, 0.03);
        player.stop();
        player.disconnect();
      } catch (e) {}
      this.players[id] = undefined;
    }
  }

  downRamp(player, duration) {
    const {context} = this;
    return new Promise((resolve) => {
      player.gainNode.gain.setValueAtTime(0, context.currentTime + duration);
      setTimeout(resolve, duration);
    });
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

LinearSampler.configTypes = {
  filePath: "string",
  bottomNote: "string",
  topNote: "string",
  offset: "number",
  loop: "boolean",
  advance: "number"
};

export default LinearSampler;
