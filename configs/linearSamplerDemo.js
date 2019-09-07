export const plugins = [
  {
    name: "output",
    path: "AudioDestination.js"
  },
  {
    name: "sampler",
    path: "LinearSampler.js",
    options: {
      filePath: "/assets/pianoc3.mp3",
      bottomNote: "A0",
      topNote: "C7",
      offset: 3.36,
      loop: true,
      advance: 0.06
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
