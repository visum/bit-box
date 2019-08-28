import Observable from "../lib/Observable.js";

// https://pages.mtu.edu/~suits/NoteFreqCalcs.html
const generateFrequencyTable = (referencePitch, referenceNote) => {
  const notes = [];
  for (let i = 0; i <= 127; i++) {
    const distanceFromReference = i - referenceNote;
    notes[i] =
      referencePitch * Math.pow(Math.pow(2, 1 / 12), distanceFromReference);
  }
  return notes;
};

const generateNotesToNumbers = () => {
  const noteNames = [
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "Fb",
    "E#",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
    "A",
    "A#",
    "Bb",
    "B",
    "Cb",
    "B#"
  ];
  const sequence = [
    0,
    1,
    0,
    1,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    0,
    1
  ];
  // 21 is A0
  let noteNumber = 20;
  let octaveNumber = 0;
  // octave numbers reset at C, but our list starts at A
  let octaveIndex = 15;
  const notesToNumbers = {};
  while (noteNumber <= 108) {
    while (octaveIndex < sequence.length) {
      const thisNoteName = noteNames[octaveIndex] + octaveNumber;
      const thisNoteNumber = (noteNumber += sequence[octaveIndex]);
      notesToNumbers[thisNoteName] = thisNoteNumber;
      octaveIndex += 1;
    }
    octaveIndex = 0;
    octaveNumber += 1;
  }
  return notesToNumbers;
};

class NoteToFrequency extends Observable {
  constructor() {
    super();
    this.name = "NoteToFrequency";
    this.observed = new Map();

    this.eventHandlers = {
      play: event => {
        const noteNumber = NoteToFrequency.notesToNumbers[event.note];
        const frequency = NoteToFrequency.frequencyTable[noteNumber];

        this.notify({
          ...event,
          type: "startSound",
          frequency
        });
      },
      stop: event => {
        this.notify({ ...event, type: "stopSound" });
      }
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    }
  }

  subscribeTo(observable) {
    if (this.observed.has(observable)) {
      throw new Error(
        `NoteToFrequency is already observing ${observable.name}`
      );
    }
    const observer = observable.observe(this.handleEvent);
    this.observed.set(observable, observer);
  }

  unsubscribeFrom(observable) {
    if (this.observed.has(observable)) {
      const observer = this.observed.get(observable);
      observer.dispose();
      this.observed.delete(observable);
    }
  }
}

NoteToFrequency.frequencyTable = generateFrequencyTable(440, 69);
NoteToFrequency.notesToNumbers = generateNotesToNumbers();

NoteToFrequency.respondsTo = {
  play: {
    description: "Start playing a note",
    params: {
      note: {
        type: "string",
        description: "the note name, like Ab3, to start playing"
      },
      id: {
        type: "number",
        description: "an arbitrary value that correlates the start/stop events"
      }
    }
  },
  stop: {
    description: "Stop playing the note with the matching id",
    params: {
      id: {
        type: "number"
      }
    }
  }
};

export default NoteToFrequency;