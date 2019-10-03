export default {
  Analyzer: {
    path: "AudioAnalyzer.js",
    config: {
      smoothingTimeConstant: "number"
    }
  },
  AudioDestination: {
    path:"AudioDestination.js"
  },
  AudioNode: {
    path: "AudioNode.js"
  },
  Clock: {
    path: "Clock.js",
    config: {
      beatsPerMeasure: "number",
      beatsPerMinute: "number",
      ticksPerBeat: "number"
    }
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
  MIDIInput: {
    path: "MIDIInput.js",
    config: {
      channel: "number"
    }
  },
  NoteEventDelay: {
    path: "NoteEventDelay.js",
    config: {
      time: "number"
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
  Reverb: {
    path: "Reverb.js",
    config: {
      response: [
        "AirportTerminal.mp3",
        "OutdoorBlastoff.mp3",
        "PlateMedium.mp3"
      ]
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
  },
  WebSocketInput: {
    path: "WebSocketInput.js",
    config: {
      host: "string"
    }
  }
};
