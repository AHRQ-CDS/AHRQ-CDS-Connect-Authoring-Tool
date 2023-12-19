import * as _ from 'lodash';

export const changeToCase = (string, desiredCase) => {
  // The following cases are based on the change-case library, which was removed in November 2023
  // since its new ESM-only distribution is not compatible with this project. We've removed the
  // unused options and re-implemented the remaining options using lodash.
  switch (desiredCase) {
    case 'camelCase': // test string => testString
      return _.camelCase(string) || string;
    case 'capitalCase': // test string => Test String
      return _.startCase(_.snakeCase(string)) || string;
    case 'constantCase': // test string => TEST_STRING
      return _.toUpper(_.snakeCase(string)) || string;
    case 'noCase': // test string => test string
      return _.snakeCase(string).replace(/_+/g, ' ') || string;
    case 'noCaseWithParens': // test string => test string
      return (
        string
          .split(/[^A-Z0-9()]/gi)
          .join(' ')
          .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .toLocaleLowerCase()
          .trim() || string
      );
    case 'snakeCase': // test string => test_string
      return _.snakeCase(string) || string;
    default:
      return null;
  }
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
