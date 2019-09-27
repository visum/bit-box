export const plugins = [
  {
    "name": "Analyzer",
    "path": "AudioAnalyzer.js",
    "options": {
      "smoothingTimeConstant": 0.85
    }
  },
  {
    "name": "KeyboardInput",
    "path": "KeyboardInput.js"
  },
  {
    "name": "NoteToFrequency",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "Oscillator",
    "path": "Oscillator.js",
    "options": {
      "waveType": "sine",
      "attack": 0.1,
      "decay": 0.3
    }
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  },
  {
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.20000000298023224
    }
  }
];

export const patches = [
  {
    "source": "KeyboardInput",
    "target": "NoteToFrequency",
    "type": "event"
  },
  {
    "source": "NoteToFrequency",
    "target": "Oscillator",
    "type": "event"
  },
  {
    "source": "Oscillator",
    "target": "Gain",
    "type": "audio"
  },
  {
    "source": "Gain",
    "target": "Analyzer",
    "type": "audio"
  },
  {
    "source": "Gain",
    "target": "AudioDestination",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "Analyzer": [
      678,
      64
    ],
    "KeyboardInput": [
      1,
      55
    ],
    "NoteToFrequency": [
      203,
      45
    ],
    "Oscillator": [
      110,
      203
    ],
    "AudioDestination": [
      458,
      359
    ],
    "Gain": [
      329,
      209
    ]
  }
};
