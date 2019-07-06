import Clock from "./Clock.js";
import Sine from "./instruments/Sine.js";

const instrumentTypes = {
  "sine": Sine
};

export default class Machine {
  constructor(global) {
    const AudioContext = global.AudioContext || global.webkitAudioContext;

    const context = new AudioContext();
    const gain = context.createGain();

    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.7, context.currentTime);
    
    this.context = context;
    this.destination = context.destination;
    this.masterGain = gain;
    this.tracks = [];
    this.clock = new Clock();
  }

  setVolume(newValue) {
    const {masterGain, context} = this;
    masterGain.gain.setValueAtTime(newValue, context.currentTime);
  }

  addInstrumentToTrack(type, track, connectToAudioOut) {
    const {context, clock, tracks, masterGain} = this;
    if (tracks[track] != null) {
      console.error("Track " + track + " already has an instrument assigned");
      return;
    }
    const Instrument = instrumentTypes[type];
    const instrument = new Instrument(context);
    clock.subscribe(instrument);
    if (connectToAudioOut) {
      instrument.setAudioOutput(masterGain);
    }
    tracks[track] = instrument;
  }

  removeInstrumentFromTrack(track) {
    const {tracks, clock} = this;
    // other cleanup stuff here?
    const instrument = tracks[track];
    clock.unsubscribe(instrument);
    tracks[track] = null;
  }

  playNoteOnTrackForTime(note, trackNumber, time) {
    const {tracks} = this;
    const track = tracks[trackNumber];
    track.noteOn(note);
    setTimeout(() => {
      track.noteOff();  
    }, time);
  }

  noteOn(note, trackNumber, velocity = 100) {
    const {tracks} = this;
    const track = tracks[trackNumber];
    if (track) {
      track.noteOn(note, velocity);
    }
  }

  noteOff(note, trackNumber) {
    const {tracks} = this;
    const track = tracks[trackNumber];
    if (track) {
      track.noteOff(note);
    }
  }

  panic() {
    const {tracks} = this;
    for (let i in tracks) {
      const track = tracks[i];
      if (track) {
        track.panic();
      }
    }
  }

  slide(freq, duration) {
    const {oscillator, context} = this;
    oscillator.frequency.setValueAtTime(freq, context.currentTime);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.frequency.exponentialRampToValueAtTime(freq*2, context.currentTime+duration);
  }
  
}