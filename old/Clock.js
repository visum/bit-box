export default class Clock {
  constructor() {
    this.subscribers = [];
    this.time = 0;
    this.tempo = 120; // in BPM
    this.running = false;
  }

  subscribe(client) {
    if (!client.notify) {
      console.error("Clock clients must expose a 'notify' method.");
      return;
    }
    this.subscribers.push(client);
  }

  unsubscribe(client) {
    const index = this.subscribers.indexOf(client);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  notify(event) {
    this.subscribers.forEach((subscriber) => {
      subscriber.notify(event);
    });
  }

  tick() {
    this.time += 1;
    const beatFraction = this.time / 16;
    const beat = beatFraction % 1 === 0 ? beatFraction : false;
    const event = {
      type: "clock:tick",
      time: this.time,
      beat: beat
    };
    this.notify(event);
    if (this.running) {
      const beatsPerSecond = this.tempo / 60;
      const ticksPerSecond = beatsPerSecond * 16;
      const delay = 1000 / ticksPerSecond;
      setTimeout(this.tick, delay);
    }
  }

  start() {
    this.running = true;
    tick();
  }

  stop() {
    this.running = false;
    this.notify({
      type: "clock:stop"
    });
  }

  reset() {
    this.time = 0;
    this.notify({
      type: "clock:reset"
    });
  }

  seek(time) {
    this.time = time;
    this.notify({
      type: "clock:seek",
      time: time
    });
  }

}