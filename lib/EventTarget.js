export default function() {

  this.observed = new Map();

  this.subscribeTo = (source) => {
    if (this.observed.has(source)) {
      throw new Error(`${this.name} already observing ${source.name}`)
    }
    const observer = source.observe(this.handleEvent);
    this.observed.set(source, observer);
  };

  this.unsubscribeFrom = (source) => {
    if (this.observed.has(source)) {
      const observer = this.observed.get(source);
      observer.dispose();
      this.observed.delete(source);
    }
  };

}
