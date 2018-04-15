# AB Testing on the server
This package aims to provide a opinionated implementation of (blue-red-testing)[https://github.com/gyfchong/blue-red-testing].

## Get started

Install the package
`yarn add blue-red-node-testing`

Find a cosy place in your server where you can access `res` and `req` to place this test as it requires access to your cookies.
```
import aBTest from 'blue-red-node-testing;

const abTesting = aBTest(res, req);

const fooBarTest = abTesting("foobar test", [
  {
    name: "foo",
    weight: 0.5 // this defaults to 0.5
    outcome: true
  },
  {
    name: "bar",
    weight: 0.5 // this defaults to 0.5
    outcome: false
  }
]);

console.log(fooBarTest.name); // Returns the full name of the test, ie. AB_TEST_foobar-test

console.log(fooBarTest.result.groupName); // Returns "foo" or "bar"
console.log(fooBarTest.result.outcome); // Returns `true` or `false`

console.log(fooBarTest.digitalData); // The full name of the test and the bucket name, ie. AB_TEST_foobar-test_foo
```

## What's happening?!
Under the hood, this function...
* Assigns a random ID to every visitor
* Places them in either bucket A or bucket B.
* Stores the random ID in a cookie.
* Returns the outcome of the test
* When the user re-visits it will read the cookie and put that user into the same bucket as their initial visit.

### What if I want a specific outcome every visit?
If you change the cookie name to one of the buckets, it will force the test to always return the outcome of that bucket (ie. changing the cookie value to "foo" will result in the test returning `true` as the outcome)

### Why do you mess with the name?
I append "AB_TEST_" so that you can easily recognise this name in the cookie, and anywhere else it's used.

### Can I use my own visitor identifier?
Not at the moment. (PR's welcome!)

### What's this digitalData thing?
This is pamarily used for Google Analytics, so you can track what bucket is being shown on page load. Technically I return the bucket name, so you could choose to ignore this and format it however you want.