export default suite => {
  suite("simpleTest", test => {
    test("assert", assert => {
      assert(true);
    });

    test("assert.equal", assert => {
      assert.equal(1, 1);
      assert.equal(1, "1");
    });

    test("assert.equal.not", assert => {
      assert.equal.not(1, 2);
      assert.equal.not(1, "2");
    });

    test("assert.equivalent", assert => {
      assert.equivalent(1, 1);
      assert.equivalent("1", "1");
    });

    test("assert.equivalent.not", assert => {
      assert.equivalent.not("1", 1);
      assert.equivalent.not(0, false);
    });

    test("assert.throws", assert => {
      assert.throws(() => {
        throw new Error("I expected to do this!");
      });
    });

    test("assert.throws.not", assert => {
      assert.throws.not(() => {
        return true;
      });
    });
  });
};
