import AudioNode from "./AudioNode.js";
import EventTarget from "../lib/EventTarget.js";
import { notesToNumbers, frequencyTable } from "../lib/noteHelpers.js";

class Sampler extends AudioNode {
  constructor(options) {
    super(options);
    this.name = "Sampler";

    EventTarget.apply(this);

    this.targets = new Map();

    this.players = {};
    this.buffer = null;
    this.naturalNote = options.naturalNote;
    this.loop = options.loop;
    this.filePath = options.filePath;
    this.context = options.context;

    this.eventHandlers = {
      play: ({note, id}) => {
        this.start(note, id);
      },
      stop: ({id}) => {
        this.stop(id);
      }
    };

    this.load();

    this.handleEvent = this.handleEvent.bind(this);
  }

  async load() {
    const {filePath, context} = this;
    const audioData = await (await fetch(filePath)).arrayBuffer();
    context.decodeAudioData(audioData, buffer => {
      this.buffer = buffer;
    });
  }

  start(note, id) {
    const {context, buffer, targets, naturalNote, loop} = this;
    if (targets.size === 0) {
      console.error("LinearSampler can't play before it is connected to a source");
      return;
    }
    if (!buffer) {
      return;
    }

    const noteNumber = notesToNumbers[note];
    const naturalNoteNumber = notesToNumbers[naturalNote];
    const toneOffset = (noteNumber - naturalNoteNumber) * 100;

    const bufferSource = context.createBufferSource();
    const gainNode = context.createGain();
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    bufferSource.detune.value = toneOffset;
    targets.forEach(targetNode => gainNode.connect(targetNode));
    if (loop) {
      bufferSource.loop = true;
    }

    bufferSource.start();

    this.players[id] = {gainNode, bufferSource};
  }

  async stop(id) {
    const player = this.players[id];
    const {bufferSource, gainNode} = player;
    if (player) {
      try {
        await this.downRamp(player, 0.02);
        bufferSource.stop();
        bufferSource.disconnect();
        this.targets.forEach(targetNode => gainNode.disconnect(targetNode));
      } catch (e) {
        console.error(e);
      }
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
    this.targets.set(target, target.getAudioNode());
  }

  disconnect(target) {
    this.targets.delete(target);
  }

}

Sampler.configTypes = {
  filePath: "string",
  naturalNote: "string",
  loop: "boolean"
};

export default Sampler;