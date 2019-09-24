export const plugins = [
  {
    "name": "output",
    "path": "AudioDestination.js"
  },
  {
    "name": "sampler",
    "path": "LinearSampler.js",
    "options": {
      "filePath": "./assets/pianoc3.mp3",
      "bottomNote": "A0",
      "topNote": "C7",
      "offset": 3.36,
      "loop": true,
      "advance": 0.06
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
      2,
      33
    ],
    "sampler": [
      192,
      36
    ],
    "finalGain": [
      394,
      33
    ],
    "output": [
      576,
      36
    ]
  }
};