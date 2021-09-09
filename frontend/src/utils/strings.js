import * as changeCase from 'change-case';

export const changeToCase = (string, desiredCase, options) => {
  const acceptedCases = [
    'camelCase', // test string => testString
    'capitalCase', // test string => Test String
    'constantCase', // test string => TEST_STRING
    'dotCase', // test string => test.string
    'headerCase', // test string => Test-String
    'noCase', // test string => test string
    'paramCase', // test string => test-string
    'pascalCase', // test string => TestString
    'pathCase', // test string => test/string
    'sentenceCase', // testString => Test string
    'snakeCase' // test string => test_string
  ];

  if (acceptedCases.indexOf(desiredCase) > -1) return changeCase[desiredCase](string, options) || string;

  return null;
};

export const startsWithVowel = toCheck => {
  const vowelRegex = '^[aieouAEIOU].*';
  return toCheck.match(vowelRegex);
};

export const valueToString = value => {
  if (value == null) return '';
  switch (typeof value) {
    case 'number':
      return value.toString();
    case 'object':
      return value.str;
    default:
      return value;
  }
};
