export const plugins = [
  {
    "name": "DrumMachine",
    "path": "DrumMachine.js",
    "options": {
      "gain": 0.3
    }
  },
  {
    "name": "KeyboardInput",
    "path": "KeyboardInput.js"
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  }
];

export const patches = [
  {
    "source": "KeyboardInput",
    "target": "DrumMachine",
    "type": "event"
  },
  {
    "source": "DrumMachine",
    "target": "AudioDestination",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "DrumMachine": [
      387,
      134
    ],
    "KeyboardInput": [
      70,
      149
    ],
    "AudioDestination": [
      587,
      141
    ]
  }
};