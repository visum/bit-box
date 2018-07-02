export default class Instrument{
  constructor(context) {
    this.context = context;
  }

  notify(event) {
    // should be overridden
  }

  setAudioOutput() {
    // snould be overridden
  }

  panic() {
    // turn everything off
  }
}