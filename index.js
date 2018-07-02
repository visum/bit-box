import Machine from "./lib/Machine.js";
import Qwerty from "./lib/inputs/Qwerty.js";

window.machine = new Machine(window);
window.qwertyInput = new Qwerty(window);

qwertyInput.attach(machine, 0);

machine.addInstrumentToTrack('sine', 0, true);
// machine.noteOn("C4", 0, 0.7);
// machine.noteOn("E4", 0, 0.7);
// machine.noteOn("G4", 0, 0.7);

// setTimeout(() => {
//   machine.noteOff("C4", 0);
//   machine.noteOff("E4", 0);
//   machine.noteOff("G4", 0);
// }, 1000);
