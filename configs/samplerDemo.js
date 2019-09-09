export const plugins = [
  {
    name: "output",
    path: "AudioDestination.js"
  },
  {
    name: "sampler",
    path: "Sampler.js",
    options: {
      filePath: "/assets/mao.mp3",
      naturalNote: "C4",
      sampleDuration: 1,
      loop: false
    }
  },
  {
    name: "finalGain",
    path: "Gain.js",
    options: {
      value: 0.7
    }
  },
  {
    name: "input",
    path: "KeyboardInput.js"
  }
];

export const patches = [
  {
    type: "event",
    source: "input",
    target: "sampler"
  },
  {
    type: "audio",
    source: "sampler",
    target: "finalGain"
  },
  {
    type: "audio",
    source: "finalGain",
    target: "output"
  }
];
