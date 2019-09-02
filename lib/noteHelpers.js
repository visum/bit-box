
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
  const numbersToNotes = {};
  while (noteNumber <= 108) {
    while (octaveIndex < sequence.length) {
      const thisNoteName = noteNames[octaveIndex] + octaveNumber;
      const thisNoteNumber = (noteNumber += sequence[octaveIndex]);
      notesToNumbers[thisNoteName] = thisNoteNumber;
      numbersToNotes[thisNoteNumber] = thisNoteName;
      octaveIndex += 1;
    }
    octaveIndex = 0;
    octaveNumber += 1;
  }
  return {notesToNumbers, numbersToNotes};
};

let currentNoteId = 0;

const getNoteId = () => {
  currentNoteId += 1;
  if (currentNoteId > 200000) {
    currentNoteId = 0;
  }
  return currentNoteId;
};

export const frequencyTable = generateFrequencyTable(440, 69);
export const {notesToNumbers, numbersToNotes} = generateNotesToNumbers();
export {getNoteId};