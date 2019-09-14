export const plugins = [
  {
    path: "KeyboardInput.js",
    name: "keyboardInput"
  },
  {
    path: "AudioDestination.js",
    name: "destination"
  },
  {
    path: "NoteToFrequency.js",
    name: "noteToFrequency"
  },
  {
    path: "SineGenerator.js",
    name: "noisemaker"
  }
];

export const patches = [
  {
    type: "event",
    source: "keyboardInput",
    target: "noteToFrequency"
  },
  {
    type: "event",
    source: "noteToFrequency",
    target: "noisemaker"
  },
  {
    type: "audio",
    source: "noisemaker",
    target: "destination"
  }
];

export const meta = {
  positions: {
    keyboardInput: [0, 40],
    noteToFrequency: [120, 40],
    noisemaker: [240, 40],
    destination: [360, 40]
  }
};
