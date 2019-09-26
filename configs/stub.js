export const plugins = [
  {
    "name": "KeyboardInput",
    "path": "KeyboardInput.js"
  },
  {
    "name": "NoteToFrequency",
    "path": "NoteToFrequency.js"
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
    "source": "Gain",
    "target": "AudioDestination",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "KeyboardInput": [
      26,
      67
    ],
    "NoteToFrequency": [
      204,
      68
    ],
    "AudioDestination": [
      707,
      68
    ],
    "Gain": [
      536,
      68
    ]
  }
};
