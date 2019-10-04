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
  AudioInput:{
    path: "AudioInput.js",
    config: {
      gain: "number"
    }
  },
  Clock: {
    path: "Clock.js",
    config: {
      beatsPerMeasure: "number",
      beatsPerMinute: "number",
      ticksPerBeat: "number"
    }
  },
  Delay: {
    path: "Delay.js",
    config: {
      time: "number"
    }
  },
  DrumMachine: {
    path: "DrumMachine.js",
    config: {
      gain: "number"
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
  MIDIOutput: {
    path: "MIDIOutput.js",
    config: {
      channel: "number"
    }
  },
  NoteDetector: {
    path: "NoteDetector.js",
    config: {
      interval: "number"
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
      filePath: [
        "../assets/bang.mp3",
        "../assets/chip.mp3",
        "../assets/hip.mp3",
        "../assets/mao.mp3"
      ],
      naturalNote: "string",
      loop: "boolean"
    }
  },
  StereoPanner: {
    path: "StereoPanner.js",
    config: {
      pan: "number"
    }
  },
  Transposer: {
    path: "Transposer.js",
    config: {
      factor: "number"
    }
  },
  WebSocketInput: {
    path: "WebSocketInput.js",
    config: {
      host: "string"
    }
  }
};
