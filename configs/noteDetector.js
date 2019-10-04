export const plugins = [
  {
    "name": "NoteDetector",
    "path": "NoteDetector.js",
    "options": {
      "interval": null
    }
  },
  {
    "name": "MIDIInput",
    "path": "MIDIInput.js",
    "options": {
      "channel": 1
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
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  }
];

export const patches = [
  {
    "source": "MIDIInput",
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
    "target": "AudioDestination",
    "type": "audio"
  },
  {
    "source": "Oscillator",
    "target": "NoteDetector",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "NoteDetector": [
      483,
      150
    ],
    "MIDIInput": [
      0,
      0
    ],
    "NoteToFrequency": [
      181,
      8
    ],
    "Oscillator": [
      375,
      16
    ],
    "AudioDestination": [
      586,
      12
    ]
  }
};