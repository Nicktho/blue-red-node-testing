const ABTesting = require("blue-red-testing");
const randomstring = require("randomstring");
const kebabCase = require("lodash.kebabcase");

// Example testConfig:
// [
//   {
//     name: 'bucketA',
//     weight: 0.2,
//     outcome: false,
//   },
//   {
//     name: 'bucketB',
//     weight: 0.8,
//     outcome: true,
//   },
// ]

// Test to see if the cookieValue is the name of one of the test groups in the config
const testGroupExists = (groupName, testConfig) =>
  testConfig.filter(testGroup => testGroup.name === groupName).length > 0;

// Generate the UserID or fetch the value of an existing UserID
const getUserID = (res, req, testName) => {
  const cookieExists =
    req.cookies && req.cookies[testName] && req.cookies[testName].length !== 0;

  // If the cookie exists, return the stored cookie name
  if (cookieExists) {
    return req.cookies[testName];
  }

  // If there's no existing value, generate a random string
  // to identify the current visitor
  const tempUserID = randomstring.generate();

  res.cookie(testName, tempUserID);

  return tempUserID;
};

// Get the name of the group the user was placed in.
const getTestGroup = (testObject, cookieValue, testConfig) => {
  // Test the cookieValue to see if it matches existing group values in the testConfig.
  // This allows the user to pick a specific group they want to be in. Primarily in place for testing.
  if (testGroupExists(cookieValue, testConfig)) {
    return cookieValue;
  }

  // Otherwise just take the cookieValue and place it into a new bucket
  return testObject.getGroup(cookieValue);
};

const aBTest = (res, req) => (testName, testConfig) => {
  const name = `AB_TEST_${kebabCase(testName)}`;

  const testObject = ABTesting.createTest(name, testConfig);

  const userID = getUserID(res, req, name);
  const testGroup = getTestGroup(testObject, userID, testConfig);

  return {
    name,
    result: {
      groupName: testGroup,
      outcome: testObject.test(testGroup, testConfig)
    },
    digitalData: `${name}_${testGroup}`
  };
};

module.exports = aBTest;
