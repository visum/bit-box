export const plugins = [
  {
    "name": "input",
    "path": "KeyboardInput.js"
  },
  {
    "name": "noteToFrequency",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "destination",
    "path": "AudioDestination.js"
  },
  {
    "name": "noisemaker",
    "path": "Oscillator.js"
  },
  {
    "name": "transposer",
    "path": "Transposer.js"
  },
  {
    "name": "finalGain",
    "path": "Gain.js"
  }
];
    export const patches = [
  {
    "type": "event",
    "source": "input",
    "target": "noteToFrequency"
  },
  {
    "type": "event",
    "source": "noteToFrequency",
    "target": "noisemaker"
  },
  {
    "type": "event",
    "source": "input",
    "target": "transposer"
  },
  {
    "type": "event",
    "source": "transposer",
    "target": "noteToFrequency"
  },
  {
    "type": "audio",
    "source": "noisemaker",
    "target": "finalGain"
  },
  {
    "type": "audio",
    "source": "finalGain",
    "target": "destination"
  }
];
    export const meta = {
  "positions": {
    "input": [
      0,
      40
    ],
    "noteToFrequency": [
      120,
      100
    ],
    "transposer": [
      120,
      10
    ],
    "noisemaker": [
      240,
      80
    ],
    "finalGain": [
      363,
      218
    ],
    "destination": [
      480,
      80
    ]
  }
};