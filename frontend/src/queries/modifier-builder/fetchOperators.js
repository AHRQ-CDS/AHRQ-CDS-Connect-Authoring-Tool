import axios from 'axios';
import _ from 'lodash';

const fetchOperators = async (implicitConversionInfo, { type: typeSpecifier, elementType }) => {
  const systemElementType = implicitConversionInfo.FHIRToSystem[elementType];

  let baseTypeOperators,
    conversionTypeOperators = [];
  if (systemElementType) {
    let convertedTargetType, convertedTargetElementType;
    if (systemElementType?.startsWith('Interval<')) {
      convertedTargetElementType = /Interval<(.+)>/.exec(systemElementType)[1];
      convertedTargetType = 'IntervalTypeSpecifier';
    } else if (systemElementType?.startsWith('List<')) {
      convertedTargetElementType = /List<(.+)>/.exec(systemElementType)[1];
      convertedTargetType = 'ListTypeSpecifier';
    } else if (systemElementType) {
      convertedTargetElementType = systemElementType;
      convertedTargetType = 'NamedTypeSpecifier';
    }
    conversionTypeOperators = await axios.get(
      `${process.env.REACT_APP_API_URL}/query/operator?typeSpecifier=${convertedTargetType}&elementType=${convertedTargetElementType}`
    );
  }
  baseTypeOperators = await axios.get(
    `${process.env.REACT_APP_API_URL}/query/operator?typeSpecifier=${typeSpecifier}&elementType=${elementType}`
  );
  const matchingOperators = conversionTypeOperators.data
    ? _.uniqBy([...conversionTypeOperators.data, ...baseTypeOperators.data], operator => operator.id)
    : baseTypeOperators.data;
  if (matchingOperators.length === 0) throw new Error('Error: No operators Found.');
  return matchingOperators;
};

export default fetchOperators;
