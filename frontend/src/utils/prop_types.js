export default function requiredIf(type, condition) {
  return function testProps(props) {
    const test = condition(props) ? type.isRequired : type;
    return test.apply(this, arguments); // eslint-disable-line prefer-rest-params
  };
}
