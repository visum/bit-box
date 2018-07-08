// Forward all events two all targets
export default class Splitter {
  constructor() {
    this.targets = [];
  }

  connect(target) {
    const { targets } = this;
    if (targets.indexOf(target) === -1) {
      targets.push(target);
    }
    return target;
  }

  disconnect(target) {
    const { targets } = this;
    const index = targets.indexOf(target);
    if (index !== -1) {
      targets.splice(index, 1);
    }
  }

  notify(event) {
    const { targets } = this;
    targets.forEach(target => {
      target.notify(event);
    });
  }
}
