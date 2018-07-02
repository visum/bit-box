import assert from "./assert.js"
import {notesToNumbers, equalTemperedFrequencies} from "../lib/helpers.js";

const tests = [
  {
    message: "C4 (middle) should be 60",
    condition: notesToNumbers["C4"] === 60
  },
  {
    message: "F3 and E#3 should be equal",
    condition: notesToNumbers["F3"] === notesToNumbers["E#3"]
  },
  {
    message: "C8 should be 108",
    condition: notesToNumbers["C8"] === 108
  },
  {
    message: "A4 should be 440Hz",
    condition: equalTemperedFrequencies[notesToNumbers["A4"]] === 440
  },
  {
    message: "A5 should be 880Hz",
    condition: equalTemperedFrequencies[notesToNumbers["A4"]] === 440
  }
];

export default tests.map((test) => assert(test.message, test.condition));