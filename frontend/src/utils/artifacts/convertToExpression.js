import _ from 'lodash';
import Validators from '../validators';
import { getFieldWithId } from '../../utils/instances';

function getOperation(operator) {
  switch (operator) {
    case '<': return 'less than';
    case '<=': return 'less than or equal to';
    case '=': return 'equal to';
    case '!=': return 'not equal to';
    case '>': return 'greater than';
    case '>=': return 'greater than or equal to';
    default: return '';
  }
}

// Checks if a given word starts with a vowel. If it does, return 'an'. Otherwise return 'a'.
function getArticle(word) {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
  // If the first letter is in vowels array, the word starts with a vowel.
  if (vowels.findIndex(vowel => vowel === word.charAt(0)) !== -1) {
    if (word.toLowerCase().startsWith('union')) {
      return 'a';
    }
    return 'an';
  }
  return 'a';
}

function getExpressionSentenceValue(modifier) {
  // TODO Eventually move the object for each expression onto modifier.js objects. This will likely require a migration.
  const expressionSentenceValues = {
    VerifiedObservation: { modifierText: 'verified', leadingText: '', type: 'list' },
    WithUnit: { modifierText: '', leadingText: 'with unit', type: 'post-list' },
    ValueComparisonNumber: { modifierText: 'greater than a number', leadingText: 'whose value', type: 'post' },
    ValueComparisonObservation: { modifierText: 'greater than a number', leadingText: 'whose value', type: 'post' },
    QuantityValue: { modifierText: 'quantity value', leadingText: '', type: 'value' }, // Will not be displayed in phrase
    ConceptValue: { modifierText: 'concept value', leadingText: '', type: 'value' }, // Will not be displayed in phrase
    Qualifier: { modifierText: 'with a code', leadingText: '', type: 'post' },
    ConvertObservation: { modifierText: 'convert', leadingText: 'with', type: 'post' },
    HighestObservationValue: { modifierText: 'highest', leadingText: '', type: 'descriptor' },
    ConfirmedCondition: { modifierText: 'confirmed', leadingText: '', type: 'list' },
    ActiveOrRecurring: { modifierText: 'active or recurring', leadingText: '', type: 'list' },
    ActiveConiditon: { modifierText: 'active', leadingText: '', type: 'list' },
    CompletedProcedure: { modifierText: 'completed', leadingText: '', type: 'list' },
    InProgressProcedure: { modifierText: 'in progress', leadingText: '', type: 'list' },
    ActiveMedicationStatement: { modifierText: 'active', leadingText: '', type: 'list' },
    ActiveMedicationRequest: { modifierText: 'active', leadingText: '', type: 'list' },
    ActiveOrConfirmedAllergyIntolerance: { modifierText: 'active or confirmed', leadingText: '', type: 'list' },
    EqualsString: { modifierText: 'equals', leadingText: '', type: 'post' },
    EndsWithString: { modifierText: 'ends with', leadingText: '', type: 'post' },
    StartsWithString: { modifierText: 'starts with', leadingText: '', type: 'post' },
    BeforeTimePrecise: { modifierText: 'is before', leadingText: '', type: 'post' },
    AfterTimePrecise: { modifierText: 'is after', leadingText: '', type: 'post' },
    BeforeDateTimePrecise: { modifierText: 'is before', leadingText: '', type: 'post' },
    AfterDateTimePrecise: { modifierText: 'is after', leadingText: '', type: 'post' },
    ContainsInteger: { modifierText: 'contains', leadingText: '', type: 'post' },
    ContainsDateTime: { modifierText: 'contains', leadingText: '', type: 'post' },
    ContainsDecimal: { modifierText: 'contains', leadingText: '', type: 'post' },
    ContainsQuantity: { modifierText: 'contains', leadingText: '', type: 'post' },
    BeforeInteger: { modifierText: 'is before', leadingText: '', type: 'post' },
    BeforeDateTime: { modifierText: 'is before', leadingText: '', type: 'post' },
    BeforeDecimal: { modifierText: 'is before', leadingText: '', type: 'post' },
    BeforeQuantity: { modifierText: 'is before', leadingText: '', type: 'post' },
    AfterInteger: { modifierText: 'is after', leadingText: '', type: 'post' },
    AfterDateTime: { modifierText: 'is after', leadingText: '', type: 'post' },
    AfterDecimal: { modifierText: 'is after', leadingText: '', type: 'post' },
    AfterQuantity: { modifierText: 'is after', leadingText: '', type: 'post' },
    MostRecentObservation: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    MostRecentProcedure: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    MostRecentCondition: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    LookBackObservation: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackCondition: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackMedicationRequest: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackMedicationStatement: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackProcedure: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    Count: { modifierText: 'count', leadingText: 'with a', type: 'Count' },
    BooleanExists: { modifierText: 'exists', leadingText: 'that', type: 'BooleanExists' },
    BooleanComparison: { modifierText: 'is true', leadingText: 'which', type: 'post' },
    CheckExistence: { modifierText: 'is null', leadingText: '', type: 'post' },
    BooleanNot: { modifierText: 'not', leadingText: '', type: 'not' },
    InProgress: { modifierText: 'in progress', leadingText: '', type: 'list' },
    AllTrue: { modifierText: 'all elements true', leadingText: 'with', type: 'post' },
    AnyTrue: { modifierText: 'any element true', leadingText: 'with', type: 'post' }
  };

  // Don't display the expression if it is not filled out completely.
  if (modifier.validator) {
    const validator = Validators[modifier.validator.type];
    const values = modifier.validator.fields.map(v => modifier.values && modifier.values[v]);
    const args = modifier.validator.args ? modifier.validator.args.map(v => modifier.values[v]) : [];
    if (!validator.check(values, args)) {
      return {};
    }
  }

  if (expressionSentenceValues[modifier.id]) {
    // Apply any user provided values needed
    switch (modifier.id) {
      case 'WithUnit': {
        expressionSentenceValues[modifier.id].modifierText = `${modifier.values.unit}`;
        break;
      }
      case 'ValueComparisonNumber': {
        const minOperatorWord = getOperation(modifier.values.minOperator);
        const maxOperatorWord = getOperation(modifier.values.maxOperator);
        expressionSentenceValues[modifier.id].modifierText =
          `is ${minOperatorWord} ${modifier.values.minValue}`;
        if (maxOperatorWord) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` and is ${maxOperatorWord} ${modifier.values.maxValue}`;
        }
        break;
      }
      case 'ValueComparisonObservation': {
        const minOperatorWord = getOperation(modifier.values.minOperator);
        const maxOperatorWord = getOperation(modifier.values.maxOperator);
        expressionSentenceValues[modifier.id].modifierText =
          `is ${minOperatorWord} ${modifier.values.minValue} ${modifier.values.unit}`;
        if (maxOperatorWord) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` and is ${maxOperatorWord} ${modifier.values.maxValue} ${modifier.values.unit}`;
        }
        break;
      }
      case 'Qualifier': {
        const qualifierText = modifier.values.qualifier ? modifier.values.qualifier : '';
        let valueSetText = modifier.values.valueSet ? modifier.values.valueSet.name : '';
        if (!valueSetText) {
          if (modifier.values.code) {
            if (modifier.values.code.display) {
              valueSetText = modifier.values.code.display;
            } else {
              valueSetText = `${modifier.values.code.code} (${modifier.values.code.codeSystem.name})`;
            }
          }
        }
        expressionSentenceValues[modifier.id].modifierText = `whose ${qualifierText} ${valueSetText}`;
        break;
      }
      case 'ConvertObservation': {
        const conversionDescription = modifier.values.description ? modifier.values.description : modifier.values.value;
        expressionSentenceValues[modifier.id].modifierText = `units converted from ${conversionDescription}`;
        break;
      }
      case 'EqualsString':
      case 'EndsWithString':
      case 'StartsWithString': {
        expressionSentenceValues[modifier.id].leadingText = 'whose value';
        expressionSentenceValues[modifier.id].modifierText = `${_.lowerCase(modifier.name)} "${modifier.values.value}"`;
        break;
      }
      case 'BeforeTimePrecise':
      case 'AfterTimePrecise': {
        expressionSentenceValues[modifier.id].leadingText = 'whose value is';
        if (modifier.values.precision) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` the ${modifier.values.precision} of`;
        }
        expressionSentenceValues[modifier.id].modifierText +=
          ` ${modifier.values.time.split('T')[1]}`;
        break;
      }
      case 'BeforeDateTimePrecise':
      case 'AfterDateTimePrecise': {
        expressionSentenceValues[modifier.id].leadingText = 'whose value is';
        if (modifier.values.precision) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` the ${modifier.values.precision} of`;
        }
        expressionSentenceValues[modifier.id].modifierText +=
          ` ${modifier.values.date.split('@')[1]}`;
        if (modifier.values.time) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` at ${modifier.values.time.split('T')[1]}`;
        }
        break;
      }
      case 'ContainsInteger':
      case 'BeforeInteger':
      case 'AfterInteger':
      case 'ContainsDecimal':
      case 'BeforeDecimal':
      case 'AfterDecimal': {
        expressionSentenceValues[modifier.id].leadingText =
          (modifier.name === 'Contains') ? 'whose value' : 'whose value is';
        expressionSentenceValues[modifier.id].modifierText +=
            ` ${modifier.values.value}`;
        break;
      }
      case 'ContainsDateTime':
      case 'BeforeDateTime':
      case 'AfterDateTime': {
        expressionSentenceValues[modifier.id].leadingText =
          (modifier.name === 'Contains') ? 'whose value' : 'whose value is';
        expressionSentenceValues[modifier.id].modifierText +=
          ` ${modifier.values.date.split('@')[1]}`;
        if (modifier.values.time) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` at ${modifier.values.time.split('T')[1]}`;
        }
        break;
      }
      case 'ContainsQuantity':
      case 'BeforeQuantity':
      case 'AfterQuantity': {
        expressionSentenceValues[modifier.id].leadingText =
        (modifier.name === 'Contains') ? 'whose value' : 'whose value is';
        expressionSentenceValues[modifier.id].modifierText +=
          ` ${modifier.values.value} '${modifier.values.unit}'`;
        break;
      }
      case 'LookBackObservation':
      case 'LookBackCondition':
      case 'LookBackMedicationRequest':
      case 'LookBackMedicationStatement':
      case 'LookBackProcedure': {
        expressionSentenceValues[modifier.id].modifierText =
          `within the last ${modifier.values.value} ${modifier.values.unit}`;
        break;
      }
      case 'BooleanComparison': {
        expressionSentenceValues[modifier.id].modifierText = modifier.values.value;
        break;
      }
      case 'CheckExistence': {
        expressionSentenceValues[modifier.id].modifierText = modifier.values.value;
        break;
      }
      default: break;
    }
    const expressionSentenceValue = Object.assign({ ...expressionSentenceValues[modifier.id] }, { id: modifier.id });
    return expressionSentenceValue;
  }

  // If the modifier is not listed in the object, return just the name of the modifier to be placed at the end.
  return { modifierText: _.lowerCase(modifier.name), leadingText: '', type: 'post', id: modifier.id };
}

// Some expressions need specific leading text for the Count expression since it changes the subject of the expression
function updateExpressionsForCountExpression(expressionArray) {
  return expressionArray.map((expression) => {
    if (expression.id === 'ValueComparisonNumber') {
      expression.leadingText = '';
    }
    return expression;
  });
}

function addVSandCodeText(expressionArray, valueSets, codes) {
  // If there is more than one value set/code, add the rest to a tooltip.
  let tooltipText = '';
  const valueSetValues = valueSets.map(vs => vs.name);
  const codeValues = codes.map(code =>
    ((code.display && code.display.length < 110) ? code.display : `${code.code} (${code.codeSystem.name})`));
  const allValues = valueSetValues.concat(codeValues);

  if (allValues.length > 0) {
    expressionArray.push({ expressionText: 'with a code from', isExpression: false });
  }

  allValues.forEach((name, i) => {
    if (i > 2) { // Anything after the first three values gets added to the tooltip
      if (i === allValues.length - 1) { // Add 'or' before the last value listed
        tooltipText += 'or';
      }
      tooltipText += ` ${name},`;
    } else { // Any value within the first three values gets added to the phrase text individually
      if (i === allValues.length - 1 && i !== 0) { // Add 'or' before the last value listed, as long as it is not the only one
        expressionArray.push({ expressionText: 'or', isExpression: false });
      }
      // If there are only two values to add OR you are at the end of the list, don't add a comma after the name
      if ((i === 0 && allValues.length === 2) || i === allValues.length - 1) {
        expressionArray.push({ expressionText: name, isExpression: true });
      } else {
        expressionArray.push({ expressionText: name, isExpression: true });
        expressionArray.push({ expressionText: ',', isExpression: false });
      }
    }
  });

  if (tooltipText) {
    expressionArray.push({ expressionText: 'or', isExpression: false });
    tooltipText = tooltipText.slice(0, -1); // Remove trailing comma
    expressionArray.push({ expressionText: '...', isExpression: true, tooltipText: `...${tooltipText}` });
  }

  return expressionArray;
}

function addElementNames(expressionArray, elementNames, type, isBaseElementAndOr) {
  if ((type === 'And' || type === 'Or') && isBaseElementAndOr) {
    expressionArray.push({ expressionText: 'that satisfies', isExpression: false });
  }

  elementNames.forEach((nameObject, i) => {
    if (i === elementNames.length - 1 && i !== 0) {
      if (type === 'And' || type === 'Or') {
        expressionArray.push({ expressionText: _.lowerCase(type), isExpression: false, isType: true });
      } else {
        expressionArray.push({ expressionText: 'and', isExpression: false });
      }
    }
    if ((i === 0 && elementNames.length === 2) || i === elementNames.length - 1) {
      expressionArray.push({
        expressionText: nameObject.name,
        isExpression: true,
        isName: true,
        tooltipText: nameObject.tooltipText
      });
    } else {
      expressionArray.push({
        expressionText: nameObject.name,
        isExpression: true,
        isName: true,
        tooltipText: nameObject.tooltipText
      });
      expressionArray.push({ expressionText: ',', isExpression: false });
    }
  });

  return expressionArray;
}

function addExpressionText(expressionArray, expression, type = null) {
  // Add any text needed ahead of the modifier
  if (expression.leadingText && !(type === 'parameter' || type === 'externalCqlElement')) {
    expressionArray.push({ expressionText: expression.leadingText, isExpression: false });
  }
  // Add the modifier text
  expressionArray.push({ expressionText: expression.modifierText, isExpression: true });
  return expressionArray;
}

function getOrderedExpressionSentenceArrayForAgeRange(expressionArray, ageFields) {
  let orderedExpressionArray = [];
  orderedExpressionArray.push({ expressionText: 'The patient\'s', isExpression: false });
  orderedExpressionArray.push({ expressionText: 'age', isExpression: false, isType: true });
  orderedExpressionArray.push({ expressionText: 'is', isExpression: false });

  const minAgeField = getFieldWithId(ageFields, 'min_age');
  const maxAgeField = getFieldWithId(ageFields, 'max_age');
  const unitField = getFieldWithId(ageFields, 'unit_of_time');

  const ageUnitString = `${(unitField && unitField.value) ? unitField.value.name : ''}`;

  if (minAgeField.value && maxAgeField.value) { // The minimum age and the maximum age are both added
    orderedExpressionArray.push({ expressionText: 'between', isExpression: false });
    orderedExpressionArray.push({
      expressionText: `${minAgeField.value} ${ageUnitString}`,
      isExpression: true
    });
    orderedExpressionArray.push({ expressionText: 'and', isExpression: false });
    orderedExpressionArray.push({
      expressionText: `${maxAgeField.value} ${ageUnitString}`,
      isExpression: true
    });
  } else if (minAgeField.value) { // Only a minimum age is added
    orderedExpressionArray.push({ expressionText: 'at least', isExpression: false });
    orderedExpressionArray.push({
      expressionText: `${minAgeField.value} ${ageUnitString}`,
      isExpression: true
    });
  } else if (maxAgeField.value) { // Only a maximum age is added
    orderedExpressionArray.push({ expressionText: 'at most', isExpression: false });
    orderedExpressionArray.push({
      expressionText: `${maxAgeField.value} ${ageUnitString}`,
      isExpression: true
    });
  }

  expressionArray.forEach((expression) => {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
  });

  return orderedExpressionArray;
}

function getOrderedExpressionSentenceArrayForGender(genderFields) {
  const orderedExpressionArray = [];
  orderedExpressionArray.push({ expressionText: 'The patient\'s', isExpression: false });
  orderedExpressionArray.push({ expressionText: 'gender', isExpression: false, isType: true });
  orderedExpressionArray.push({ expressionText: 'is', isExpression: false });

  const genderField = getFieldWithId(genderFields, 'gender');
  if (genderField.value) {
    orderedExpressionArray.push({ expressionText: genderField.value.name, isExpression: true });
  }

  return orderedExpressionArray;
}

// Build the array for expression phrases by pushing each type of expression in a set order.
function orderExpressionSentenceArray(
  expressionArray,
  type,
  valueSets,
  codes,
  returnType,
  otherFields,
  elementNames,
  isBaseElementAndOr,
  referenceElementName
) {
  // Specific cases for Age Range, Gender, and Parameters since they do not follow the same pattern as VSAC elements.
  if (type === 'Age Range') {
    return getOrderedExpressionSentenceArrayForAgeRange(expressionArray, otherFields);
  }
  if (type === 'Gender') {
    // No modifiers can be applied to gender elements
    return getOrderedExpressionSentenceArrayForGender(otherFields);
  }

  if ((type === 'And' || type === 'Or') && !isBaseElementAndOr) {
    const andOrExpressionArray = [];
    return addElementNames(andOrExpressionArray, elementNames, type, isBaseElementAndOr);
  }

  let orderedExpressionArray = [];
  const countExpression = expressionArray.find(expression => expression.type === 'Count');
  const notExpression = expressionArray.find(expression => expression.type === 'not');
  const existsExpression = expressionArray.find(expression => expression.type === 'BooleanExists');
  const descriptorExpression = expressionArray.find(expression => expression.type === 'descriptor');
  const listExpressions = expressionArray.filter(expression => expression.type === 'list');
  const postListExpressions = expressionArray.find(expression => expression.type === 'post-list');
  const checkExistenceExpression = expressionArray.find((expression) => {
    const nulls = ['is null', 'is not null'];
    return nulls.indexOf(expression.modifierText) !== -1;
  });
  let otherExpressions = _.uniqWith(expressionArray.filter((expression) => {
    const knownTypes = ['not', 'BooleanExists', 'descriptor', 'list', 'post-list', 'value', 'Count'];
    return knownTypes.indexOf(expression.type) === -1;
  }), _.isEqual);
  let hasStarted = false;

  // Count modifier will always refer to a group of elements, so always treat it as plural
  const returnsPlural = returnType.includes('list_of_') || countExpression;
  const returnsBoolean = returnType === 'boolean';

  if (countExpression) {
    otherExpressions = updateExpressionsForCountExpression(otherExpressions);
  }

  // Handle not and exists
  if (existsExpression) {
    if (notExpression) {
      orderedExpressionArray.push({ expressionText: 'There does', isExpression: false });
      orderedExpressionArray.push({ expressionText: 'not', isExpression: true });
      orderedExpressionArray.push({ expressionText: 'exist', isExpression: true });
      hasStarted = true;
      if (checkExistenceExpression) {
        orderedExpressionArray.push({ expressionText: 'a case where', isExpression: false });
      }
    } else {
      orderedExpressionArray.push({ expressionText: 'There', isExpression: false });
      orderedExpressionArray.push({ expressionText: 'exists', isExpression: true });
      hasStarted = true;
    }
  } else if (!returnsPlural && returnsBoolean && !checkExistenceExpression) {
    if (notExpression && (type === 'parameter' || type === 'externalCqlElement')) {
      orderedExpressionArray.push({ expressionText: 'Not', isExpression: true });
      hasStarted = true;
    } else if (notExpression && !(type === 'parameter' || type === 'externalCqlElement')) {
      orderedExpressionArray.push({ expressionText: 'There does', isExpression: false });
      orderedExpressionArray.push({ expressionText: 'not', isExpression: true });
      orderedExpressionArray.push({ expressionText: 'exist', isExpression: false });
      hasStarted = true;
    } else if (!(type === 'parameter' || type === 'externalCqlElement')) {
      orderedExpressionArray.push({ expressionText: 'There exists', isExpression: false });
      hasStarted = true;
    }
  } else if (notExpression && !countExpression) {
    if (checkExistenceExpression) {
      orderedExpressionArray.push({ expressionText: 'It is', isExpression: false });
      orderedExpressionArray.push({ expressionText: 'not', isExpression: true });
      orderedExpressionArray.push({ expressionText: 'the case that', isExpression: false });
      hasStarted = true;
    }
  } else if (countExpression) {
    const article = notExpression ? 'the' : 'The';
    if (notExpression) {
      orderedExpressionArray.push({ expressionText: 'It is', isExpression: false });
      orderedExpressionArray.push({ expressionText: 'not', isExpression: true });
      orderedExpressionArray.push({ expressionText: 'the case that', isExpression: false });
    }
    orderedExpressionArray.push({ expressionText: article, isExpression: false });
    orderedExpressionArray.push({ expressionText: 'count', isExpression: true });
    orderedExpressionArray.push({ expressionText: 'of', isExpression: false });
    hasStarted = true;
  }

  // Handle descriptors (ex. highest, most recent)
  if (descriptorExpression) {
    const descriptorText = descriptorExpression.modifierText;
    const descriptorArticle = descriptorText === 'highest' ? 'the' : getArticle(descriptorText);
    if (hasStarted) {
      orderedExpressionArray.push({ expressionText: descriptorArticle, isExpression: false });
      orderedExpressionArray.push({ expressionText: descriptorText, isExpression: true });
    } else {
      orderedExpressionArray.push({ expressionText: _.capitalize(descriptorArticle), isExpression: false });
      orderedExpressionArray.push({ expressionText: descriptorText, isExpression: true });
      hasStarted = true;
    }
  }

  // Handle lists (ex. verified, active, confirmed)
  if (listExpressions.length > 0) {
    listExpressions.forEach((listExpression, index) => {
      const listText = listExpression.modifierText;
      const listArticle = getArticle(listText);
      if (hasStarted) {
        if (!descriptorExpression && index === 0 && !countExpression) {
          orderedExpressionArray.push({ expressionText: listArticle, isExpression: false });
        }
        orderedExpressionArray.push({ expressionText: listText, isExpression: true });
      } else {
        orderedExpressionArray.push({ expressionText: _.capitalize(listText), isExpression: true });
        hasStarted = true;
      }
    });
  }

  // Handle element types (ex. observation, procedure)
  let elementText = _.lowerCase(type);
  if (type === 'Intersect') {
    elementText = 'intersection';
  } else if (type === 'And' || type === 'Or') {
    if (isBaseElementAndOr) {
      elementText = 'base element';
    } else {
      elementText = 'group';
    }
  } else if (type === 'externalCqlElement') {
    elementText = 'external CQL element';
  }
  const elementArticle = (!(type === 'parameter' || type === 'externalCqlElement')) ? getArticle(elementText) : 'the';
  if (hasStarted) {
    if (returnsPlural) {
      if (type !== 'Intersect' && type !== 'Union') elementText = `${elementText}s`;
      orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    } else if (descriptorExpression || listExpressions.length > 0) {
      orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    } else {
      orderedExpressionArray.push({ expressionText: elementArticle, isExpression: false });
      orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    }
  } else if (returnsPlural) {
    if (type !== 'Intersect' && type !== 'Union') {
      elementText = `${_.capitalize(elementText)}s`;
    } else {
      elementText = `${_.capitalize(elementText)}`;
    }
    orderedExpressionArray.push({
      expressionText: elementText,
      isExpression: false,
      isType: true
    });
    hasStarted = true;
  } else {
    orderedExpressionArray.push({ expressionText: _.capitalize(elementArticle), isExpression: false });
    orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    hasStarted = true;
  }
  if (type === 'Intersect' || type === 'Union') {
    orderedExpressionArray.push({ expressionText: 'of', isExpression: false });
  }
  if (type === 'parameter' || type === 'externalCqlElement') {
    orderedExpressionArray.push({ expressionText: referenceElementName, isExpression: true });
  }

  // Handle value sets and codes and other element names
  orderedExpressionArray = addVSandCodeText(orderedExpressionArray, valueSets, codes);
  orderedExpressionArray = addElementNames(orderedExpressionArray, elementNames, type, isBaseElementAndOr);

  // Handle post-lists (with unit)
  if (postListExpressions) {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, postListExpressions, type);
  }

  // Handle any remaining expressions at the end, except concept/quantity value
  otherExpressions.forEach((expression) => {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, expression, type);
  });

  return orderedExpressionArray;
}

export default function convertToExpression(
  expressionsArray = [],
  type,
  valueSets,
  codes,
  returnType,
  otherFields = [],
  elementNames = [],
  isBaseElementAndOr = false,
  referenceElementName = null
) {
  const expressionSentenceArray = expressionsArray.reduce((accumulator, currentExpression) => {
    const expressionSentenceValue = getExpressionSentenceValue(currentExpression);
    if (expressionSentenceValue && !_.isEqual(expressionSentenceValue, {})) {
      accumulator.push(expressionSentenceValue);
    }
    return accumulator;
  }, []);

  // Get an order for the expressions that will make sense in a sentence
  const orderedExpressionSentenceArray = orderExpressionSentenceArray(
    expressionSentenceArray,
    type,
    valueSets,
    codes,
    returnType,
    otherFields,
    elementNames,
    isBaseElementAndOr,
    referenceElementName
  );

  return orderedExpressionSentenceArray;
}
