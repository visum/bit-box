export const plugins = [
  {
    "name": "MIDIOutput",
    "path": "MIDIOutput.js",
    "options": {
      "channel": 1
    }
  },
  {
    "name": "KeyboardInput",
    "path": "KeyboardInput.js"
  }
];

export const patches = [
  {
    "source": "KeyboardInput",
    "target": "MIDIOutput",
    "type": "event"
  }
];

export const meta = {
  "positions": {
    "MIDIOutput": [
      344,
      105
    ],
    "KeyboardInput": [
      67,
      93
    ]
  }
};