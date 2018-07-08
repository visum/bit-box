import Machine from "./lib/Machine.js";
import invention, {setup} from "./lib/rolls/invention.js";

window.machine = new Machine(window);
machine.setVolume(0.2);

machine.loadSetup(setup);
