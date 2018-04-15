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

test("that given the same UserID, you get the same outcome", t => {
  const testConfig = [
    {
      name: "foo",
      outcome: true
    },
    {
      name: "bar",
      outcome: false
    }
  ];

  const fooBartest1 = fn(res, req)("foobar test", testConfig);

  req.cookies["AB_TEST_foobar-test"] = fooBartest1.userID;

  const fooBartest2 = fn(res, req)("foobar test", testConfig);

  t.is(fooBartest1.result.outcome, fooBartest2.result.outcome);
});

test("that you can create and run multiple tests", t => {
  const testing = fn(res, req);

  const testConfig1 = [
    {
      name: "foo",
      outcome: true
    },
    {
      name: "bar",
      outcome: false
    }
  ];

  const testConfig2 = [
    {
      name: "hello",
      outcome: { abstract: true }
    },
    {
      name: "world",
      outcome: { flat: false }
    }
  ];

  const fooBartest1 = testing("foobar test one", testConfig1);
  const fooBartest2 = testing("foobar test two", testConfig2);

  t.true(
    fooBartest1.result.outcome !== undefined ||
      fooBartest1.result.outcome !== null
  );
  t.true(
    fooBartest2.result.outcome !== undefined ||
      fooBartest1.result.outcome !== null
  );
});
