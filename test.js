import helpers from "./tests/helpers.test.js";
import environment from "./tests/environment.test.js";
import bQuery from "./lib/bQuery.js";

const B = bQuery(document);

const testContainer = B("#test-container")[0];
const passResultTemplate = B("#test-result-pass-template")[0];
const failResultTemplate = B("#test-result-fail-template")[0];
const suiteTemplate = B("#test-suite-template")[0];

// add suites here
const suites = [
  {
    name: "Environment",
    results: environment
  }, {
    name: "Helpers",
    results: helpers
  }
];

suites.forEach((suite) => {
  const suiteElement = document.importNode(suiteTemplate.content, true);
  bQuery(suiteElement)(".name")[0].textContent = suite.name;
  suite.results.forEach((result) => {
    const resultTemplate = result.pass ? passResultTemplate : failResultTemplate;
    const resultElement = document.importNode(resultTemplate.content, true);
    
    bQuery(resultElement)(".message")[0].textContent = result.message;

    bQuery(suiteElement)(".results")[0].appendChild(resultElement);
  });
  testContainer.appendChild(suiteElement);
});