import helpers from "./tests/helpers.test.js";
import environment from "./tests/environment.test.js";
import basicOscillatorTest from "./tests/BasicOscillator.test.js";
import basicInstrumentTest from "./tests/BasicInstrument.test.js";

import context from "./lib/plugins/audioContextSingleton.js";

const testContainer = document.querySelector("#test-container");
const passResultTemplate = document.querySelector("#test-result-pass-template");
const failResultTemplate = document.querySelector("#test-result-fail-template");
const suiteTemplate = document.querySelector("#test-suite-template");
const startButton = document.querySelector("#start-button");

https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
startButton.addEventListener("click", () => {
  context.resume();
  runTests();
});

function runTests() {
  //basicOscillatorTest();
  basicInstrumentTest();
}
