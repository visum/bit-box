import clone from "../clone.js";

export default class VelocityAdjuster {
  constructor({adjustment}) {
    this.adjustment = adjustment;
    this.target = null;
  }

  notify(event) {
    const {target, adjustment} = this;
    if (target && target.notify){
      if (event.velocity) {
        const newEvent = clone(event);
        newEvent.velocity = event.velocity * adjustment;
        target.notify(newEvent);
      } else {
        target.notify(event);
      }
    }
  }

  connect(target) {
    this.target = target;
    return target;
  }
}