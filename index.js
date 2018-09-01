import Machine from "./lib/Machine.js";
import invention, {setup} from "./lib/rolls/invention.js";

window.machine = new Machine(window);

machine.loadSetup(setup);
