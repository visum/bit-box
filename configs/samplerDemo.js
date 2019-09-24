export const plugins = [
  {
    "name": "output",
    "path": "AudioDestination.js"
  },
  {
    "name": "sampler",
    "path": "Sampler.js",
    "options": {
      "filePath": "./assets/mao.mp3",
      "naturalNote": "C4",
      "loop": false
    }
  },
  {
    "name": "finalGain",
    "path": "Gain.js",
    "options": {
      "value": 0.699999988079071
    }
  },
  {
    "name": "input",
    "path": "KeyboardInput.js"
  }
];

export const patches = [
  {
    "source": "input",
    "target": "sampler",
    "type": "event"
  },
  {
    "source": "sampler",
    "target": "finalGain",
    "type": "audio"
  },
  {
    "source": "finalGain",
    "target": "output",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "input": [
      5,
      42
    ],
    "sampler": [
      169,
      42
    ],
    "finalGain": [
      354,
      43
    ],
    "output": [
      543,
      40
    ]
  }
};