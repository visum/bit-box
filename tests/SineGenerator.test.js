import SineGenerator from "../plugins/SineGenerator.js";
import AudioContext from "./mocks/AudioContext.js";
import AudioNode from "./mocks/AudioNode.js";
import Observable from "../lib/Observable.js";

export default suite => {
  suite("SineGenerator", test => {
    test("constructor", assert => {
      const node = new SineGenerator({context:new AudioContext()});
      assert(node);
    });

    test("connect", assert => {
      const target = new AudioNode();
      const node = new SineGenerator({context: new AudioContext()});

      node.connect(target);

      assert.equivalent(node.target, target);
    });

    test("disconnect", assert => {
      const node = new SineGenerator({conext: new AudioContext()});
      const target = new AudioNode();

      node.connect(target);

      node.disconnect();

      assert.equal(node.target, null);
    });

    test("bad connection", assert => {
      const node = new SineGenerator({context: new AudioContext()});
      const target = {};

      assert.throws(() => {
        node.connect(target);
      });
    });

    test("start without target", assert => {
      const node = new SineGenerator({conext: new AudioContext()});

      assert.throws(() => {
        node.start(440, 12345);
      });
    });

    test("start with target", assert => {
      const context = new AudioContext();
      const target = new AudioNode();
      const node = new SineGenerator({context: context});

      node.connect(target);

      node.start(440, 12345);

      const oscillator = node.oscillators[12345];

      assert.equal("running", oscillator.state);
    });

    test("stop", assert => {
      const context = new AudioContext();
      const target = new AudioNode();
      const node = new SineGenerator({context: context});

      node.connect(target);

      node.start(440, 12345);

      const oscillator = node.oscillators[12345];

      node.stop(12345);

      assert.equal("stopped", oscillator.state);
      assert.equal(null, node.oscillators[12345]);
    });

    test("stop with multiple notes", assert => {
      const context = new AudioContext();
      const target = new AudioNode();
      const node = new SineGenerator({context: context});

      node.connect(target);

      node.start(440, 1);
      node.start(880, 3);

      const firstOscillator = node.oscillators[1];
      const secondOscillator = node.oscillators[3];

      node.stop(1);

      assert.equal("stopped", firstOscillator.state);
      assert.equal(null, node.oscillators[1]);
      assert.equal("running", secondOscillator.state);
    });

    test("subscribeTo", assert => {
      const node = new SineGenerator({context: new AudioContext()});
      const observable = new Observable();
      const target = new AudioNode();

      node.subscribeTo(observable);
      node.connect(target);

      observable.notify({
        type: "startSound",
        frequency: 440,
        id: 1
      });

      const oscillator = node.oscillators[1];

      assert("running", oscillator.state);

      observable.notify({
        type: "stopSound",
        id: 1
      });

      assert("stopped", oscillator.state);
    });

    test("unsubscribeFrom", assert => {
      const node = new SineGenerator({context: new AudioContext()});
      const observable = new Observable();
      const target = new AudioNode();
  
      node.subscribeTo(observable);
      node.connect(target);
  
      node.unscribeFrom(observable);
  
      observable.notify({
        type: "startSound",
        frequency: 440,
        id: 1
      });
  
      assert.equal(node.oscillators[1], null);
    });
    
  });

};
