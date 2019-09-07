import KeyboardInput from "../../plugins/KeyboardInput.js";
import AudioDestination from "../../plugins/AudioDestination.js";
import NoteToFrequency from "../../plugins/NoteToFrequency.js";
import Oscillator from "../../plugins/Oscillator.js";

const start = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();

  const destination = new AudioDestination({context});
  const noteToFrequency = new NoteToFrequency();
  const sound = new Oscillator({context, waveType: "square"});
  const input = new KeyboardInput();

  noteToFrequency.subscribeTo(input);
  sound.subscribeTo(noteToFrequency);
  sound.connect(destination);
};


document.getElementById("go").addEventListener("click", start);
