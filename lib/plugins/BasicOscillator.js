export default class BasicOscillator {
  constructor({frequency, context, type, target}) {
    this.frequency = frequency;
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(target);
    this.oscillator = oscillator;
  }

  start() {
    this.oscillator.start();
  }

  stop() {
    this.oscillator.stop();
    this.oscillator.disconnect();
  }
}