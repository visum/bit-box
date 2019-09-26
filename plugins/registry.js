export default {
  AudioDestination: {
    path:"AudioDestination.js"
  },
  AudioNode: {
    path: "AudioNode.js"
  },
  Gain: {
    path: "Gain.js",
    config: {
      value: "number"
    }
  },
  KeyboardInput: {
    path: "KeyboardInput.js"
  },
  LinearSampler: {
    path: "LinearSampler.js",
    config: {
      filePath: "string",
      bottomNote: "string",
      topNote: "string",
      offset: "number",
      loop: "boolean",
      advance: "number"
    }
  },
  NoteToFrequency: {
    path: "NoteToFrequency.js"
  },
  Oscillator: {
    path: "Oscillator.js",
    config: {
      waveType: [
        "sine",
        "sawtooth",
        "square"
      ],
      attack: "number",
      decay: "number"
    }
  },
  Sampler: {
    path: "Sampler.js",
    config: {
      filePath: "string",
      naturalNote: "string",
      loop: "boolean"
    }
  },
  Transposer: {
    path: "Transposer.js",
    config: {
      factor: "number"
    }
  },
  PeriodicWave: {
    path: "PeriodicWave.js",
    config: {
      waveTablePath: [
        "../assets/waveTables/bass.js",
        "../assets/waveTables/britBlues.js",
        "../assets/waveTables/throaty.js"
      ],
      attack: "number",
      decay: "number"
    }
  },
  Delay: {
    path: "Delay.js",
    config: {
      time: "number"
    }
  }
};
