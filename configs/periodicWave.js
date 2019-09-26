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
    "name": "PeriodicWave",
    "path": "PeriodicWave.js",
    "options": {
      "attack": 0.2,
      "decay": 0.5,
      "waveTablePath": "../assets/waveTables/bass.js"
    }
  },
  {
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.6000000238418579
    }
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
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
    "target": "PeriodicWave",
    "type": "event"
  },
  {
    "source": "PeriodicWave",
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
    "KeyboardInput": [
      65,
      118
    ],
    "NoteToFrequency": [
      261,
      119
    ],
    "PeriodicWave": [
      450,
      118
    ],
    "Gain": [
      622,
      116
    ],
    "AudioDestination": [
      820,
      115
    ]
  }
};