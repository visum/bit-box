import KeyboardInput from "../../plugins/KeyboardInput.js";
import AudioDestination from "../../plugins/AudioDestination.js";
import NoteToFrequency from "../../plugins/NoteToFrequency.js";
import SineGenerator from "../../plugins/SineGenerator.js";

const start = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();

  const destination = new AudioDestination({context});
  const noteToFrequency = new NoteToFrequency();
  const sound = new SineGenerator({context});
  const input = new KeyboardInput();

  noteToFrequency.subscribeTo(input);
  sound.subscribeTo(noteToFrequency);
  sound.connect(destination);
};


document.getElementById("go").addEventListener("click", start);
