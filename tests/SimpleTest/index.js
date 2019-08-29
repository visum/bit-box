import "./TestSuite.js";
import "./TestCase.js";
import "./TestResult.js";

const testResultFactory = (message) => {
  const element = document.createElement('test-result');
  element.textContent = message;
  return element;
};

export default class SimpleTest {
  constructor(hostElement) {
    this.hostElement = hostElement;
    this.suite = this.suite.bind(this);
  }

  suite(name, handler) {
    const suiteElement = document.createElement('test-suite');
    suiteElement.title = name;
   
    const test = (name, handler) => {

      const caseElement = document.createElement("test-case");
      caseElement.title = name;

      const assert = (value) => {
        if (value) {
          caseElement.pass();
        } else {
          caseElement.fail(`❌: ${value}`);
        }
      };
      
      assert.equal = (expected, actual) => {
        if (expected == actual) {
          caseElement.pass();
        } else {
          caseElement.fail(`❌ expected ${expected}, got ${actual}`);
        }
      };
      
      assert.equal.not = (expected, actual) => {
        if (expected != actual) {
          caseElement.pass();
        } else {
          caseElement.fail(`❌ expected ${expected} to not equal ${actual}`);
        }
      };
      
      assert.equivalent = (expected, actual) => {
        if (expected === actual) {
          caseElement.pass();
        } else {
          caseElement.fail(`❌ expected ${expected}, got ${actual}`);
        }
      };
      
      assert.equivalent.not = (expected, actual) => {
        if (expected !== actual) {
          caseElement.pass();
        } else {
          caseElement.fail(`❌ expected ${expected} to not be equivalent to ${actual}`);
        }
      };
  
      assert.throws = (fn) => {
        try {
          fn();
        } catch(e) {
          caseElement.pass();
          return;
        }
        caseElement.fail(`❌ exception expected, none thrown`);
      };
  
      assert.throws.not = (fn) => {
        try {
          fn();
        } catch (e) {
          caseElement.fail(`❌ unexpected exception: ${e.message}`);
          return;
        }
        caseElement.pass();
      };

      assert.async = (timeout = 300) => {
        return (handler) => {
          
          const timeoutId = setTimeout(() => {
            caseElement.fail(`❌ async test timed out`);
          }, timeout);

          const resolver = () => {
            clearTimeout(timeoutId);
          };

          handler(resolver);
        };
      };

      
      try {
        handler(assert);
      } catch (e) {
        caseElement.fail(`❌ test threw exception: ${e.message}`);
      }

      suiteElement.appendChild(caseElement);
    };

    handler(test);

    this.hostElement.appendChild(suiteElement);
  };
}
