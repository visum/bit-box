import Observable from "../lib/Observable.js";

export default suite => {
  return suite("Observable", test => {
    test("constructor", assert => {
      const observable = new Observable();
      assert.equivalent("object", typeof observable);
      assert(Array.isArray(observable.observers));
      assert.equivalent("function", typeof observable.observe);
    });

    test(".observe", assert => {
      const observable = new Observable();
      const observer = observable.observe(o => o);
      assert.equivalent("object", typeof observer);
    });

    test(".observable.notify", assert => {
      const observable = new Observable();
      let called = false;
      const handler = e => {
        called = true;
      };
      observable.observe(handler);
      observable.notify({});
      assert(called);
    });

    test("observer.pause/start", assert => {
      const observable = new Observable();
      let callCount = 0;
      const handler = e => {
        callCount++;
      };
      const observer = observable.observe(handler);
      observable.notify({});
      observer.pause();
      observable.notify({});
      observer.start();
      observable.notify({});
      assert.equivalent(2, callCount);
    });

    test("observer.dispose", assert => {
      const observable = new Observable();
      let callCount = 0;
      const handler = e => callCount++;
      const observer = observable.observe(handler);
      observable.notify({});
      observer.dispose();
      observable.notify({});
      assert.equivalent(1, callCount);
      assert.equivalent(0, observable.observers.length);
    });

    test("observer.filter", assert => {
      const observable = new Observable();
      let callCount = 0;
      const handler = e => callCount++;
      const observer = observable.observe(handler);
      observer.filter = e => e.type === "cherries";
      observable.notify({ type: "cherries" });
      observable.notify({ type: "apples" });
      observable.notify({ type: "bananas" });
      assert.equivalent(1, callCount);
    });

    test("observe.filter throw with non-function", assert => {
      const observable = new Observable();
      const observer = observable.observe(() => {});
      assert.throws(() => {
        observer.filter = "not a function";
      });
    });
  });
};
