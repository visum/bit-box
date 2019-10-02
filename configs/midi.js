export const plugins = [
  {
    "name": "MIDIInput",
    "path": "MIDIInput.js",
    "options": {}
  },
  {
    "name": "NoteToFrequency",
    "path": "NoteToFrequency.js"
  },
  {
    "name": "PeriodicWave",
    "path": "PeriodicWave.js",
    "options": {
      "waveTablePath": "../assets/waveTables/bass.js",
      "attack": 0.1,
      "decay": 0.1
    }
  },
  {
    "name": "Reverb",
    "path": "Reverb.js",
    "options": {
      "response": "PlateMedium.mp3"
    }
  },
  {
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.30000001192092896
    }
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  },
  {
    "name": "Gain2",
    "path": "Gain.js",
    "options": {
      "value": 0.8999999761581421
    }
  },
  {
    "name": "Analyzer",
    "path": "AudioAnalyzer.js",
    "options": {
      "smoothingTimeConstant": 0.8
    }
  },
  {
    "name": "LinearSampler",
    "path": "LinearSampler.js",
    "options": {
      "filePath": "./assets/pianoc3.mp3",
      "bottomNote": "A0",
      "topNote": "C7",
      "offset": 3.36,
      "loop": false,
      "advance": 0.06
    }
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
    "target": "PeriodicWave",
    "type": "event"
  },
  {
    "source": "Reverb",
    "target": "Gain",
    "type": "audio"
  },
  {
    "source": "Gain",
    "target": "AudioDestination",
    "type": "audio"
  },
  {
    "source": "PeriodicWave",
    "target": "Gain2",
    "type": "audio"
  },
  {
    "source": "Gain2",
    "target": "Reverb",
    "type": "audio"
  },
  {
    "source": "Gain",
    "target": "Analyzer",
    "type": "audio"
  },
  {
    "source": "MIDIInput",
    "target": "LinearSampler",
    "type": "event"
  },
  {
    "source": "LinearSampler",
    "target": "Gain",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "MIDIInput": [
      0,
      0
    ],
    "NoteToFrequency": [
      182,
      9
    ],
    "PeriodicWave": [
      343,
      13
    ],
    "Reverb": [
      184,
      151
    ],
    "Gain": [
      356,
      146
    ],
    "AudioDestination": [
      544,
      134
    ],
    "Gain2": [
      525,
      12
    ],
    "Analyzer": [
      714,
      33
    ],
    "LinearSampler": [
      93,
      252
    ]
  }
};