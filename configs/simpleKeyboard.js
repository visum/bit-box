export const plugins = [
  {
    "name": "keyboardInput",
    "path": "KeyboardInput.js"
  },
  {
    "name": "destination",
    "path": "AudioDestination.js"
  },
  {
    "name": "noteToFrequency",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "noisemaker",
    "path": "Oscillator.js",
    "options": {
      "waveType": "sine",
      "attack": 0.2,
      "decay": 0.3
    }
  },
  {
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.5
    }
  }
];

export const patches = [
  {
    "source": "keyboardInput",
    "target": "noteToFrequency",
    "type": "event"
  },
  {
    "source": "noteToFrequency",
    "target": "noisemaker",
    "type": "event"
  },
  {
    "source": "Gain",
    "target": "destination",
    "type": "audio"
  },
  {
    "source": "noisemaker",
    "target": "Gain",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "keyboardInput": [
      0,
      40
    ],
    "noteToFrequency": [
      163,
      39
    ],
    "noisemaker": [
      277,
      146
    ],
    "destination": [
      593,
      32
    ],
    "StereoPanner": [
      380,
      36
    ],
    "Gain": [
      486,
      147
    ]
  }
};