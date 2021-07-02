import { operators as mockOperators } from 'data/modifier-builder';

const { implicitConversionInfo, operators } = mockOperators;

// TODO: hook up to API
const fetchOperators = async ({ type: typeSpecifier, elementType }) => {
  const systemElementType = implicitConversionInfo.FHIRToSystem[elementType];

  let systemElementMatcher = () => false;
  if (systemElementType?.startsWith('Interval<')) {
    const targetElementType = /Interval<(.+)>/.exec(systemElementType)[1];
    systemElementMatcher = operator =>
      operator.primaryOperand.typeSpecifier === 'IntervalTypeSpecifier' &&
      operator.primaryOperand.elementTypes.includes(targetElementType);
  } else if (systemElementType?.startsWith('List<')) {
    const targetElementType = /List<(.+)>/.exec(systemElementType)[1];
    systemElementMatcher = operator =>
      operator.primaryOperand.typeSpecifier === 'ListTypeSpecifier' &&
      operator.primaryOperand.elementTypes.includes(targetElementType);
  } else if (systemElementType) {
    systemElementMatcher = operator =>
      operator.primaryOperand.typeSpecifier === 'NamedTypeSpecifier' &&
      operator.primaryOperand.elementTypes.includes(systemElementType);
  }

  const matchingOperators = operators.filter(
    operator =>
      systemElementMatcher(operator) ||
      (operator.primaryOperand.typeSpecifier === typeSpecifier &&
        operator.primaryOperand.elementTypes.some(type => type === elementType || type === 'System.Any'))
  );

  if (matchingOperators.length === 0) throw new Error('Error: No operators Found.');
  return matchingOperators;
};

export default fetchOperators;
