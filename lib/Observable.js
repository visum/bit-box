class Observer {
  constructor(source, handler) {
    this.source = source;
    this.handler = handler;
    this.isPaused = false;
    this._filter = event => true;

    this.notify.bind(this);
    this.dispose.bind(this);
    this.start.bind(this);
    this.pause.bind(this);
  }

  set filter(value) {
    if (typeof value !== "function") {
      throw new Error("filter must be a function");
    }
    this._filter = value;
  }

  get filter() {
    return this._filter;
  }

  notify(event) {
    if (!this.isPaused && this.filter(event)) {
      this.handler(event);
    }
  }

  dispose() {
    this.source.removeObserver(this);
  }

  start() {
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
  }
}

export default class Observable {
  constructor() {
    this.observers = [];
    this.name = "Observable";
    this.observe.bind(this);
    this.removeObserver.bind(this);
    this.notify.bind(this);
  }

  observe(handler) {
    const observer = new Observer(this, handler);
    this.observers.push(observer);
    return observer;
  }

  removeObserver(observer) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex > -1) {
      this.observers.splice(observerIndex, 1);
    } else {
      throw new Error("Observable can't remove observer it doesn't own");
    }
  }

  notify(event) {
    this.observers.forEach(observer => observer.notify(event));
  }
}
