/* eslint-disable no-multi-spaces */
import * as changeCase from 'change-case';

export default function changeToCase(string, desiredCase) {
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

  if (acceptedCases.indexOf(desiredCase) > -1) {
    return changeCase[desiredCase](string);
  }

  return null;
}
