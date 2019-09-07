import SimpleTest from "./SimpleTest/index.js";

import observable from "./observable.test.js";
import simpleTest from "./simpleTest.test.js";
import audioDestination from "./AudioDestination.test.js";
import keyboardInput from "./KeyboardInput.test.js";
import noteToFrequency from "./NoteToFrequency.test.js";
import oscillator from "./Oscillator.test.js";

const testGroups = [
  simpleTest,
  observable,
  audioDestination,
  keyboardInput,
  noteToFrequency,
  oscillator
];

const output = document.querySelector("#output");

const { suite } = new SimpleTest(output);

testGroups.forEach(group => group(suite));
