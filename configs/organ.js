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
    "name": "Transposer",
    "path": "Transposer.js",
    "options": {
      "factor": 7
    }
  },
  {
    "name": "Transposer12",
    "path": "Transposer.js",
    "options": {
      "factor": 12
    }
  },
  {
    "name": "NoteToFrequency7",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "NoteToFrequency12",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "Gain0",
    "path": "Gain.js",
    "options": {
      "value": 0.800000011920929
    }
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
    "name": "Oscillator7",
    "path": "Oscillator.js",
    "options": {
      "waveType": "sine",
      "attack": 0.1,
      "decay": 0.1
    }
  },
  {
    "name": "Gain7",
    "path": "Gain.js",
    "options": {
      "value": 0.4000000059604645
    }
  },
  {
    "name": "Gain12",
    "path": "Gain.js",
    "options": {
      "value": 0.20000000298023224
    }
  },
  {
    "name": "Oscillator12",
    "path": "Oscillator.js",
    "options": {
      "waveType": "sine",
      "attack": 0.1,
      "decay": 0.1
    }
  },
  {
    "name": "Master",
    "path": "Gain.js",
    "options": {
      "value": 0.6000000238418579
    }
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  },
  {
    "name": "Analyzer",
    "path": "AudioAnalyzer.js",
    "options": {
      "smoothingTimeConstant": 0.8
    }
  },
  {
    "name": "Transposer24",
    "path": "Transposer.js",
    "options": {
      "factor": 24
    }
  },
  {
    "name": "NoteToFrequency24",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "Oscillator24",
    "path": "Oscillator.js",
    "options": {
      "waveType": "sine",
      "attack": 0.1,
      "decay": 0.1
    }
  },
  {
    "name": "Gain24",
    "path": "Gain.js",
    "options": {
      "value": 0.5
    }
  }
];

export const patches = [
  {
    "source": "Master",
    "target": "AudioDestination",
    "type": "audio"
  },
  {
    "source": "Gain12",
    "target": "Master",
    "type": "audio"
  },
  {
    "source": "Gain7",
    "target": "Master",
    "type": "audio"
  },
  {
    "source": "Gain0",
    "target": "Master",
    "type": "audio"
  },
  {
    "source": "Oscillator12",
    "target": "Gain12",
    "type": "audio"
  },
  {
    "source": "Oscillator7",
    "target": "Gain7",
    "type": "audio"
  },
  {
    "source": "Oscillator",
    "target": "Gain0",
    "type": "audio"
  },
  {
    "source": "NoteToFrequency",
    "target": "Oscillator",
    "type": "event"
  },
  {
    "source": "NoteToFrequency7",
    "target": "Oscillator7",
    "type": "event"
  },
  {
    "source": "NoteToFrequency12",
    "target": "Oscillator12",
    "type": "event"
  },
  {
    "source": "Transposer12",
    "target": "NoteToFrequency12",
    "type": "event"
  },
  {
    "source": "Transposer",
    "target": "NoteToFrequency7",
    "type": "event"
  },
  {
    "source": "KeyboardInput",
    "target": "Transposer",
    "type": "event"
  },
  {
    "source": "KeyboardInput",
    "target": "Transposer12",
    "type": "event"
  },
  {
    "source": "KeyboardInput",
    "target": "NoteToFrequency",
    "type": "event"
  },
  {
    "source": "Master",
    "target": "Analyzer",
    "type": "audio"
  },
  {
    "source": "Gain24",
    "target": "Master",
    "type": "audio"
  },
  {
    "source": "Oscillator24",
    "target": "Gain24",
    "type": "audio"
  },
  {
    "source": "NoteToFrequency24",
    "target": "Oscillator24",
    "type": "event"
  },
  {
    "source": "Transposer24",
    "target": "NoteToFrequency24",
    "type": "event"
  },
  {
    "source": "KeyboardInput",
    "target": "Transposer24",
    "type": "event"
  }
];

export const meta = {
  "positions": {
    "KeyboardInput": [
      28,
      125
    ],
    "NoteToFrequency": [
      406,
      125
    ],
    "Transposer": [
      213,
      226
    ],
    "Transposer12": [
      212,
      320
    ],
    "NoteToFrequency7": [
      405,
      225
    ],
    "NoteToFrequency12": [
      406,
      319
    ],
    "Gain0": [
      766,
      126
    ],
    "PeriodicWave": [
      594,
      128
    ],
    "PeriodicWave7": [
      595,
      229
    ],
    "Oscillator": [
      580,
      128
    ],
    "Oscillator7": [
      581,
      226
    ],
    "Gain7": [
      767,
      226
    ],
    "Gain12": [
      770,
      322
    ],
    "Oscillator12": [
      578,
      323
    ],
    "Master": [
      975,
      218
    ],
    "AudioDestination": [
      1154,
      216
    ],
    "Analyzer": [
      933,
      386
    ],
    "Transposer24": [
      211,
      434
    ],
    "NoteToFrequency24": [
      405,
      431
    ],
    "Oscillator24": [
      584,
      434
    ],
    "Gain24": [
      772,
      435
    ]
  }
};