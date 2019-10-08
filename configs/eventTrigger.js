export const plugins = [
  {
    "name": "EventTrigger",
    "path": "EventTrigger.js",
    "options": {
      "event": '{"type":"play","note":"C3","id":"%noteId%"}'
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
    "source": "EventTrigger",
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
    "EventTrigger": [
      29,
      21
    ],
    "Sampler": [
      249,
      33
    ],
    "AudioDestination": [
      449,
      32
    ]
  }
};