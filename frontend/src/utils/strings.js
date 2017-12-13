/* eslint-disable no-multi-spaces */
import changeCase from 'change-case';

export default function changeToCase(string, desiredCase) {
  const acceptedCases = [
    'camelCase',          // test string => testString
    'constantCase',       // test string => TEST_STRING
    'dotCase',            // test string => test.string
    'headerCase',         // test string => Test-String
    'lowerCase',          // TEST STRING => test string
    'lowerCaseFirst',     // TEST => tEST
    'noCase',             // test string => test string
    'paramCase',          // test string => test-string
    'pascalCase',         // test string => TestString
    'pathCase',           // test string => test/string
    'sentenceCase',       // testString => Test string
    'snakeCase',          // test string => test_string
    'swapCase',           // Test String => tEST sTRING
    'titleCase',          // a simple test => A Simple Test
    'upperCase',          // test string => TEST STRING
    'upperCaseFirst'      // test => Test
  ];

  if (acceptedCases.indexOf(desiredCase) > -1) {
    return changeCase[desiredCase](string);
  }

  return null;
}
