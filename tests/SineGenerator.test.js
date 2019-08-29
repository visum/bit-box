import SineGenerator from "../plugins/SineGenerator.js";
import AudioContext from "./mocks/AudioContext.js";

export default suite => {
  suite("SineGenerator", test => {
    test("constructor", assert => {
      const node = new SineGenerator({context:new AudioContext()});
      assert(node);
    });
  });
};