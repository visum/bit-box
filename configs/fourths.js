export const plugins = [
  {
    path: "KeyboardInput.js",
    name: "input"
  },
  {
    path: "NoteToFrequency.js",
    name: "noteToFrequency"
  },
  {
    path: "AudioDestination.js",
    name: "destination"
  },
  {
    path: "SineGenerator.js",
    name: "noisemaker"
  },
  {
    path: "Transposer.js",
    name: "transposer",
    options: {
      factor: 5
    }
  },
  {
    path: "Gain.js",
    name: "finalGain",
    options: {
      value: 0.6
    }
  }
];

export const patches = [
  {
    type: "event",
    source: "input",
    target: "noteToFrequency"
  },
  {
    type: "event",
    source: "noteToFrequency",
    target: "noisemaker"
  },
  {
    type: "event",
    source: "input",
    target: "transposer"
  },
  {
    type: "event",
    source: "transposer",
    target: "noteToFrequency"
  },
  {
    type: "audio",
    source: "noisemaker",
    target: "finalGain"
  },
  {
    type: "audio",
    source: "finalGain",
    target: "destination"
  }
];
