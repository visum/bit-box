import Observable from "../lib/Observable.js";
import { getNoteId } from "../lib/noteHelpers.js";

class EventTrigger extends Observable {
  constructor(options) {
    super(options);
    this.name = "EventTrigger";
    this._event = "";
    this.event = options.event;
  }

  set event(newValue) {
    try {
      JSON.parse(newValue);
      this._event = newValue;
    } catch(e) {
      this._event = "";
      console.error("Couldn't parse the event paylod.");
    }
  }

  get event() {
    return this._event;
  }

  trigger() {
    const json = this._event.replace("%noteId%", getNoteId());
    if (this._event) {
      this.notify(JSON.parse(json));
    }
  }
}

EventTrigger.configTypes = {
  event: "string"
};

EventTrigger.stageComponent = "bb-event-trigger";

export default EventTrigger;
