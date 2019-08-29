import AudioDestination from "../plugins/AudioDestination.js";
import AudioContext from "./mocks/AudioContext.js";

export default suite => {
  return suite("AudioDestination", test => {
    test("constructor", assert => {
      const node = new AudioDestination({context:new AudioContext()});
      assert(node);
    });

    test("getAudioNode", assert => {
      const node = new AudioDestination({context: new AudioContext()});
      const audioNode = node.getAudioNode();
      assert(audioNode);
    });
  });
};
