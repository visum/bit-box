import SimpleTest from "./SimpleTest/index.js";

import observable from "./observable.test.js";
import simpleTestTests from "./simpleTest.test.js";

const output = document.querySelector("#output");

const {suite} = new SimpleTest(output);

simpleTestTests(suite);
observable(suite);
