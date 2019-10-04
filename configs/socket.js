export const plugins = [
  {
    "name": "WebSocketInput",
    "path": "WebSocketInput.js",
    "options": {
      "host": "wss://192.168.2.119:8080"
    }
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
      "decay": 0.1
    }
  },
  {
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.20000000298023224
    }
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  }
];

export const patches = [
  {
    "source": "WebSocketInput",
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
    "target": "AudioDestination",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "WebSocketInput": [
      0,
      0
    ],
    "NoteToFrequency": [
      212,
      19
    ],
    "Oscillator": [
      390,
      22
    ],
    "Gain": [
      578,
      32
    ],
    "AudioDestination": [
      760,
      45
    ]
  }
};