export default class ADSREnvelope {
  constructor(config) {
    config = config || {};

    this.attack  = config.attack || {volume:1.0, delay:0.2};
    this.decay   = config.decay || {volume:0.8, delay:0.2};
    this.sustain = config.sustain || {volume:0.7, delay:0.2};
    this.release = config.release || {volume:0.0001, delay: 0.3};
  }
}