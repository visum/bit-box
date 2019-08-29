import KeyboardInput from "../plugins/KeyboardInput.js";

export default suite => {
  suite("KeyboardInput", test => {

    test("constructor", assert => {
      const node = new KeyboardInput();
      assert(node);
      node.dispose();
    });

    // not sure if it's good or bad that the DOM is available
    // as global test environment...
    test("listeners listening", assert => {
      const event = new KeyboardEvent("keydown", {keyCode: 87});

      assert.async(30)(resolve => {
        const node = new KeyboardInput();
        node.observe(event => {
          assert.equivalent("play", event.type)
          assert.equivalent("C#4", event.note);
          assert.equal.not(null, event.id);
          resolve();
          node.dispose();
        });

        document.body.dispatchEvent(event);
      });
    });

    test("dispose", assert => {
      const event = new KeyboardEvent("keydown", {keyCode: 87});

      assert.async(30)(resolve => {
        const node = new KeyboardInput();
        let triggered = false;

        node.observe(() => {
          triggered = true;
        });

        node.dispose();

        document.body.dispatchEvent(event);
        setTimeout(() => {
          assert.equivalent(false, triggered);
          resolve();
        }, 20);
      });
    });


  });
};