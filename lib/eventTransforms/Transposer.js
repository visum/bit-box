import clone from "../clone.js";
import { notesToNumbers, numbersToNotes } from "../helpers.js";

export default class Transposer {
  constructor({offset}) {
    this.offset = offset;
    this.target = null;
  }

  notify(event) {
    const {target, offset} = this;
    if (target && target.notify){
      if (event.note) {
        const newEvent = clone(event);
        const originalNoteNumber = notesToNumbers[newEvent.note];
        newEvent.note = numbersToNotes[originalNoteNumber + offset];
        target.notify(newEvent);
      }
    }
  }

  connect(target) {
    this.target = target;
    return target;
  }
}