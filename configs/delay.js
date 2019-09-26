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
  },
  {
    "name": "PeriodicWave",
    "path": "PeriodicWave.js",
    "options": {
      "waveTablePath": "../assets/waveTables/bass.js",
      "attack": 0.1,
      "decay": 0.2
    }
  },
  {
    "name": "Delay",
    "path": "Delay.js",
    "options": {
      "time": 1
    }
  },
  {
    "name": "LoopFade",
    "path": "Gain.js",
    "options": {
      "value": 0.800000011920929
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
    "source": "PeriodicWave",
    "target": "Delay",
    "type": "audio"
  },
  {
    "source": "Delay",
    "target": "LoopFade",
    "type": "audio"
  },
  {
    "source": "LoopFade",
    "target": "Gain",
    "type": "audio"
  },
  {
    "source": "LoopFade",
    "target": "Delay",
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
    ],
    "Sampler": [
      272,
      266
    ],
    "PeriodicWave": [
      361,
      92
    ],
    "Delay": [
      397,
      252
    ],
    "LoopFade": [
      567,
      319
    ]
  }
};