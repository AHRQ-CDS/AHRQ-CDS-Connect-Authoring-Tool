import axios from 'axios';
import _ from 'lodash';

const fetchOperators = async ({ type: typeSpecifier, elementType }) => {
  const { data: implicitConversionInfo } = await axios.get(`${process.env.REACT_APP_API_URL}/query/implicitconversion`);
  const systemElementType = implicitConversionInfo.FHIRToSystem[elementType];

  let baseTypeOperators,
    conversionTypeOperators = null;
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
    conversionTypeOperators = (
      await axios.get(`${process.env.REACT_APP_API_URL}/query/operator`, {
        params: { typeSpecifier: convertedTargetType, elementType: convertedTargetElementType }
      })
    ).data;
  }

  baseTypeOperators = await axios.get(
    `${process.env.REACT_APP_API_URL}/query/operator?typeSpecifier=${typeSpecifier}&elementType=${elementType}`
  );

  const matchingOperators = conversionTypeOperators
    ? _.uniqBy([...conversionTypeOperators, ...baseTypeOperators.data], operator => operator.id)
    : baseTypeOperators.data;

  if (matchingOperators.length === 0) throw new Error('Error: No operators Found.');
  return matchingOperators;
};

export default fetchOperators;
