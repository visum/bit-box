export default class Gain {
  constructor(context) {
    this.context = context;
    const node = context.createGain();
    node.connect(context.destination);
    this.node = node;
  }

  setVolume(newValue, time) {
    const targetTime = context.currentTime + time;
    this.node.gain.linearRampToValueAtTime(newValue, targetTime);
  }
}