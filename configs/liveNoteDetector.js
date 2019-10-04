export const plugins = [
  {
    "name": "AudioInput",
    "path": "AudioInput.js",
    "options": {
      "gain": 0.699999988079071
    }
  },
  {
    "name": "NoteDetector",
    "path": "NoteDetector.js",
    "options": {
      "interval": 100
    }
  },
  {
    "name": "MIDIOutput",
    "path": "MIDIOutput.js",
    "options": {
      "channel": 2
    }
  },
  {
    "name": "Analyzer",
    "path": "AudioAnalyzer.js",
    "options": {
      "smoothingTimeConstant": 0.8
    }
  }
];

export const patches = [
  {
    "source": "AudioInput",
    "target": "NoteDetector",
    "type": "audio"
  },
  {
    "source": "NoteDetector",
    "target": "MIDIOutput",
    "type": "event"
  },
  {
    "source": "AudioInput",
    "target": "Analyzer",
    "type": "audio"
  }
];

export const meta = {
  "positions": {
    "AudioInput": [
      0,
      0
    ],
    "NoteDetector": [
      222,
      31
    ],
    "MIDIOutput": [
      432,
      33
    ],
    "Analyzer": [
      114,
      201
    ]
  }
};