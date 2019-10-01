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
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.20000000298023224
    }
  },
  {
    "name": "Reverb",
    "path": "Reverb.js",
    "options": {
      "response": "AirportTerminal.mp3"
    }
  },
  {
    "name": "PeriodicWave",
    "path": "PeriodicWave.js",
    "options": {
      "waveTablePath": "../assets/waveTables/britBlues.js",
      "attack": 0.1,
      "decay": 0.2
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
    "source": "Reverb",
    "target": "Gain",
    "type": "audio"
  },
  {
    "source": "Gain",
    "target": "destination",
    "type": "audio"
  },
  {
    "source": "noteToFrequency",
    "target": "PeriodicWave",
    "type": "event"
  },
  {
    "source": "PeriodicWave",
    "target": "Reverb",
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
      801,
      36
    ],
    "Gain": [
      634,
      38
    ],
    "Reverb": [
      481,
      38
    ],
    "PeriodicWave": [
      327,
      42
    ]
  }
};