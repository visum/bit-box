import AudioNode from "./AudioNode.js";

export default class Destination extends AudioNode {
  constructor(options) {
    super(options);
  }
  
  getAudioNode() {
    return this.context.destination; 
  }

  connect() {
    console.warn("Destination node can't be connected to anything.");
  }

  disconnect() {

  }
}