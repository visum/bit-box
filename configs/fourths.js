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
    "path": "Oscillator.js",
    "options": {
      "waveType": "square"
    }
  },
  {
    "name": "transposer",
    "path": "Transposer.js",
    "options": {
      "factor": 5
    }
  },
  {
    "name": "finalGain",
    "path": "Gain.js",
    "options": {
      "value": 0.6000000238418579
    }
  }
];

export const patches = [
  {
    "source": "input",
    "target": "noteToFrequency",
    "type": "event"
  },
  {
    "source": "noteToFrequency",
    "target": "noisemaker",
    "type": "event"
  },
  {
    "source": "input",
    "target": "transposer",
    "type": "event"
  },
  {
    "source": "transposer",
    "target": "noteToFrequency",
    "type": "event"
  },
  {
    "source": "noisemaker",
    "target": "finalGain",
    "type": "audio"
  },
  {
    "source": "finalGain",
    "target": "destination",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "input": [
      0,
      40
    ],
    "noteToFrequency": [
      157,
      190
    ],
    "transposer": [
      153,
      17
    ],
    "noisemaker": [
      300,
      57
    ],
    "finalGain": [
      457,
      66
    ],
    "destination": [
      629,
      68
    ]
  }
};