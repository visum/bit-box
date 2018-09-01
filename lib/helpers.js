const generateNotesToNumbers = () => {
  const noteNames = ["C", "C#", "Db", "D", "D#", "Eb", "E", "Fb", "E#", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "Cb", "B#"];
  const sequence =  [ 0,   1,    0,    1,   1,    0,    1,   0,    1,    0,   1,    0,    1,   1,    0,    1,   1,    0,    1,   0,    1]
  // 21 is A0
  let noteNumber = 20;
  let octaveNumber = 0;
  // octave numbers reset at C, but our list starts at A
  let octaveIndex = 15;
  const notesToNumbers = {};
  while(noteNumber <= 108 ) {
    while(octaveIndex < sequence.length) {
      const thisNoteName = noteNames[octaveIndex] + octaveNumber;
      const thisNoteNumber = noteNumber += sequence[octaveIndex];
      notesToNumbers[thisNoteName] = thisNoteNumber;
      octaveIndex += 1;
    }
    octaveIndex = 0;
    octaveNumber += 1;
  }
  return notesToNumbers;
};

// https://pages.mtu.edu/~suits/NoteFreqCalcs.html
const generateFrequencyTable = (referencePitch, referenceNote) => {
  const notes = [];
  for (let i = 0; i <= 127; i++) {
    const distanceFromReference = i - referenceNote;
    notes[i] = referencePitch * Math.pow(Math.pow(2, 1/12), distanceFromReference);
  }
  return notes;
};

const notesToNumbers = generateNotesToNumbers();
const numbersToNotes = [];

Object.keys(notesToNumbers).forEach((note) => {
  numbersToNotes[notesToNumbers[note]] = note;
});

export const equalTemperedFrequencies = generateFrequencyTable(440, 69);
export { notesToNumbers, numbersToNotes };
export const freqFromNote = (note) => equalTemperedFrequencies[notesToNumbers[note]];