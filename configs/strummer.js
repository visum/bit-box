export const plugins = [
  {
    "name": "Strummer",
    "path": "Strummer.js",
    "options": {
      "noteDelayMs": 25,
      "noteDurationMs": 1000
    }
  },
  {
    "name": "WebSocketInput",
    "path": "WebSocketInput.js",
    "options": {
      "host": "wss://192.168.2.127:8080/"
    }
  },
  {
    "name": "Sampler",
    "path": "Sampler.js",
    "options": {
      "filePath": "../assets/harp_c3.mp3",
      "naturalNote": "C3",
      "loop": false
    }
  },
  {
    "name": "AudioDestination",
    "path": "AudioDestination.js"
  }
];

export const patches = [
  {
    "source": "WebSocketInput",
    "target": "Strummer",
    "type": "event"
  },
  {
    "source": "Strummer",
    "target": "Sampler",
    "type": "event"
  },
  {
    "source": "Sampler",
    "target": "AudioDestination",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "Strummer": [
      199,
      39
    ],
    "WebSocketInput": [
      8,
      34
    ],
    "Sampler": [
      370,
      42
    ],
    "AudioDestination": [
      607,
      41
    ]
  }
};