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
    "source": "noisemaker",
    "target": "destination",
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
      333,
      30
    ],
    "destination": [
      505,
      32
    ]
  }
};