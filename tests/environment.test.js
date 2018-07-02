import assert from "./assert.js";

const tests = [
  {
    message: "AudioContext",
    condition: (() => {
      return (typeof AudioContext !== "undefined" || typeof window.webkitAudioContext !== "undefined");
    })()
  },
  {
    message: "Destructuring",
    condition: (() => {
      const someObj = {"a":"a", "b":"b"};
      const {a} = someObj;
      return a === "a";
    })()
  }
];

export default tests.map((test) => assert(test.message, test.condition));
