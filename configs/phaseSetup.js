export const plugins = [
  {
    "name": "NoteEventDelay",
    "path": "NoteEventDelay.js",
    "options": {
      "time": 2
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
  },
  {
    "name": "LinearSampler1",
    "path": "LinearSampler.js",
    "options": {
      "filePath": "./assets/pianoc3.mp3",
      "bottomNote": "A0",
      "topNote": "C7",
      "offset": 3.36,
      "loop": false,
      "advance": 0.06
    }
  },
  {
    "name": "StereoPanner",
    "path": "StereoPanner.js",
    "options": {
      "pan": 0.800000011920929
    }
  },
  {
    "name": "StereoPanner1",
    "path": "StereoPanner.js",
    "options": {
      "pan": -0.800000011920929
    }
  },
  {
    "name": "NoteEventDelay1",
    "path": "NoteEventDelay.js",
    "options": {
      "time": 2.06
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
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  },
  {
    "name": "MIDIInput",
    "path": "MIDIInput.js",
    "options": {
      "channel": 1
    }
  },
  {
    "name": "Gain",
    "path": "Gain.js",
    "options": {
      "value": 0.6000000238418579
    }
  }
];

export const patches = [
  {
    "source": "LinearSampler",
    "target": "StereoPanner",
    "type": "audio"
  },
  {
    "source": "LinearSampler1",
    "target": "StereoPanner1",
    "type": "audio"
  },
  {
    "source": "StereoPanner1",
    "target": "Reverb",
    "type": "audio"
  },
  {
    "source": "MIDIInput",
    "target": "NoteEventDelay",
    "type": "event"
  },
  {
    "source": "MIDIInput",
    "target": "NoteEventDelay1",
    "type": "event"
  },
  {
    "source": "NoteEventDelay1",
    "target": "LinearSampler1",
    "type": "event"
  },
  {
    "source": "NoteEventDelay",
    "target": "LinearSampler",
    "type": "event"
  },
  {
    "source": "StereoPanner",
    "target": "Reverb",
    "type": "audio"
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
  }
];

export const meta = {
  "positions": {
    "MIDIInput": [
      38,
      71
    ],
    "NoteEventDelay": [
      224,
      29
    ],
    "NoteToFrequency": [
      390,
      31
    ],
    "NoteToFrequency1": [
      396,
      138
    ],
    "LinearSampler": [
      392,
      26
    ],
    "LinearSampler1": [
      394,
      130
    ],
    "StereoPanner": [
      582,
      26
    ],
    "StereoPanner1": [
      579,
      120
    ],
    "NoteEventDelay1": [
      225,
      132
    ],
    "Reverb": [
      416,
      315
    ],
    "AudioDestination": [
      747,
      312
    ],
    "Gain": [
      581,
      315
    ]
  }
};