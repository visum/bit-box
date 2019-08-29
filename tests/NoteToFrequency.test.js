import NoteToFrequency from "../plugins/NoteToFrequency.js";
import Observable from "../lib/Observable.js";

export default suite => {
  suite("NoteToFrequency", (test) => {
    test("constructor", assert => {
      const node = new NoteToFrequency();
      assert(node);
    });

    test("has frequencyTable", assert => {
      assert.equivalent(440, NoteToFrequency.frequencyTable[69]);
    });

    test("has notesToNumbers", assert => {
      assert.equivalent(80, NoteToFrequency.notesToNumbers["Ab5"]);
    });

    test("subscribeTo and responds to play event", assert => {
      const node = new NoteToFrequency();
      const emitter = new Observable();

      assert.async(30)(resolve => {
        node.observe(event => {
          assert.equivalent("startSound", event.type);
          assert.equivalent(440, event.frequency);
          resolve();
        });

        node.subscribeTo(emitter);

        emitter.notify({type: "play", note: "A4"});

      });
    });

    test("unsubscribe", assert => {
      const node = new NoteToFrequency();
      const emitter = new Observable();

      assert.async(30)(resolve => {
        let triggered = false;
        node.observe(event => {
          triggered = true;
        });

        node.subscribeTo(emitter);

        setTimeout(() => {
          assert(!triggered);
          resolve();
        }, 20);

        node.unsubscribeFrom(emitter);

        emitter.notify({type: "play"});
      });
    });

  });
};