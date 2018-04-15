import test from "ava";
import fn from "..";

let res = {
  cookie: (a, b) => true
};

let req = {
  cookies: {}
};

test("that the test name is user friendly", t => {
  const fooBartest = fn(res, req)("foobar test", [
    {
      name: "foo",
      outcome: true
    },
    {
      name: "bar",
      outcome: false
    }
  ]);

  t.is(fooBartest.name, "AB_TEST_foobar-test");
});

test("that the test results return the outcome set by the cookie", t => {
  req.cookies["AB_TEST_foobar-test"] = "foo";

  const fooBartest = fn(res, req)("foobar test", [
    {
      name: "foo",
      outcome: true
    },
    {
      name: "bar",
      outcome: false
    }
  ]);

  t.true(fooBartest.result.outcome);
});

test("that the digitalData appends the correct bucket name", t => {
  const fooBartest = fn(res, req)("foobar test", [
    {
      name: "foo",
      outcome: true
    },
    {
      name: "bar",
      outcome: false
    }
  ]);

  t.is(
    fooBartest.digitalData,
    `AB_TEST_foobar-test_${fooBartest.result.groupName}`
  );
});
