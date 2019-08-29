class AudioNode {
  constructor() {

  }
}

export default class AudioContext {
  constructor() {
    this.destination = new AudioNode();
  }
}