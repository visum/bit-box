import SimpleTest from "./SimpleTest/index.js";

import observable from "./observable.test.js";
import simpleTest from "./simpleTest.test.js";
import audioDestination from "./AudioDestination.test.js";
import keyboardInput from "./KeyboardInput.test.js";
import noteToFrequency from "./NoteToFrequency.test.js";
import sineGenerator from "./SineGenerator.test.js";

const testGroups = [
  simpleTest,
  observable,
  audioDestination,
  keyboardInput,
  noteToFrequency,
  sineGenerator
];

const output = document.querySelector("#output");

const { suite } = new SimpleTest(output);

testGroups.forEach(group => group(suite));
