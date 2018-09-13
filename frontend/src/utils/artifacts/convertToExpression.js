import _ from 'lodash';
import Validators from '../validators';

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
    return 'an';
  }
  return 'a';
}

function getExpressionSentenceValue(modifier) {
  // TODO Eventually move the object for each expression onto modifier.js objects. This will likely require a migration.
  const expressionSentenceValues = {
    VerifiedObservation: { modifierText: 'verified', leadingText: '', type: 'list' },
    WithUnit: { modifierText: '', leadingText: 'with unit', type: 'post-list' },
    ValueComparisonObservation: { modifierText: 'greater than a number', leadingText: 'whose value is', type: 'post' },
    QuantityValue: { modifierText: 'quantity value', leadingText: '', type: 'value' }, // Will not be diplayed in phrase
    ConceptValue: { modifierText: 'concept value', leadingText: '', type: 'value' }, // Will not be diplayed in phrase
    Qualifier: { modifierText: 'with a code', leadingText: '', type: 'post' },
    ConvertObservation: { modifierText: 'convert', leadingText: 'with', type: 'post' },
    HighestObservationValue: { modifierText: 'highest', leadingText: '', type: 'descriptor' },
    ConfirmedCondition: { modifierText: 'confirmed', leadingText: '', type: 'list' },
    ActiveOrRecurring: { modifierText: 'active or recurring', leadingText: '', type: 'list' },
    ActiveConiditon: { modifierText: 'active', leadingText: '', type: 'list' },
    CompletedProcedure: { modifierText: 'completed', leadingText: '', type: 'list' },
    InProgressProcedure: { modifierText: 'in progress', leadingText: '', type: 'list' },
    ActiveMedicationStatement: { modifierText: 'active', leadingText: '', type: 'list' },
    ActiveMedicationOrder: { modifierText: 'active', leadingText: '', type: 'list' },
    ActiveOrConfirmedAllergyIntolerance: { modifierText: 'active or confirmed', leadingText: '', type: 'list' },
    MostRecentObservation: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    MostRecentProcedure: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    MostRecentCondition: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    LookBackObservation: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackCondition: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackMedicationOrder: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackMedicationStatement: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackProcedure: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    BooleanExists: { modifierText: 'exists', leadingText: 'that', type: 'BooleanExists' },
    BooleanComparison: { modifierText: 'is true', leadingText: 'which', type: 'post' },
    CheckExistence: { modifierText: 'is null', leadingText: '', type: 'post' },
    BooleanNot: { modifierText: 'not', leadingText: 'There does', type: 'not' },
    InProgress: { modifierText: 'in progress', leadingText: '', type: 'list' }
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
      case 'ValueComparisonObservation': {
        const minOperatorWord = getOperation(modifier.values.minOperator);
        const maxOperatorWord = getOperation(modifier.values.maxOperator);
        expressionSentenceValues[modifier.id].modifierText =
          `${minOperatorWord} ${modifier.values.minValue} ${modifier.values.unit}`;
        if (maxOperatorWord) {
          expressionSentenceValues[modifier.id].modifierText +=
            ` and ${maxOperatorWord} ${modifier.values.maxValue} ${modifier.values.unit}`;
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
        expressionSentenceValues[modifier.id].leadingText = `whose ${qualifierText}`;
        expressionSentenceValues[modifier.id].modifierText = `${valueSetText}`;
        break;
      }
      case 'ConvertObservation': {
        const conversionDescription = modifier.values.description ? modifier.values.description : modifier.values.value;
        expressionSentenceValues[modifier.id].modifierText = `units converted from ${conversionDescription}`;
        break;
      }
      case 'LookBackObservation':
      case 'LookBackCondition':
      case 'LookBackMedicationOrder':
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
    return expressionSentenceValues[modifier.id];
  }

  // If the modifier is not listed in the object, return just the name of the modifier to be placed at the end.
  return { modifierText: _.lowerCase(modifier.name), leadingText: '', type: 'post' };
}

function addVSandCodeText(expressionArray, valueSets, codes) {
  // If there is more than one value set/code, add the rest to a tooltip.
  let tooltipText = '';
  const valueSetValues = valueSets.map(vs => vs.name);
  const codeValues = codes.map(code => (code.display ? code.display : `${code.code} (${code.codeSystem.name})`));
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

function addExpressionText(expressionArray, expression) {
  // Add any text needed ahead of the modifier
  if (expression.leadingText) {
    expressionArray.push({ expressionText: expression.leadingText, isExpression: false });
  }
  // Add the modifier text
  expressionArray.push({ expressionText: expression.modifierText, isExpression: true });
  return expressionArray;
}

function getOrderedExpressionSentenceArrayForAgeRange(expressionArray, ageParameters) {
  let orderedExpressionArray = [];
  orderedExpressionArray.push({ expressionText: 'The patient\'s', isExpression: false });
  orderedExpressionArray.push({ expressionText: 'age', isExpression: false, isType: true });
  orderedExpressionArray.push({ expressionText: 'is', isExpression: false });

  if (ageParameters[0].value && ageParameters[1].value) { // The minimum age and the maximum age are both added
    orderedExpressionArray.push({ expressionText: 'between', isExpression: false });
    orderedExpressionArray.push({ expressionText: `${ageParameters[0].value} years`, isExpression: true });
    orderedExpressionArray.push({ expressionText: 'and', isExpression: false });
    orderedExpressionArray.push({ expressionText: `${ageParameters[1].value} years`, isExpression: true });
  } else if (ageParameters[0].value) { // Only a minimum age is added
    orderedExpressionArray.push({ expressionText: 'at least', isExpression: false });
    orderedExpressionArray.push({ expressionText: `${ageParameters[0].value} years`, isExpression: true });
  } else if (ageParameters[1].value) { // Only a maximum age is added
    orderedExpressionArray.push({ expressionText: 'at most', isExpression: false });
    orderedExpressionArray.push({ expressionText: `${ageParameters[1].value} years`, isExpression: true });
  }

  expressionArray.forEach((expression) => {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
  });

  return orderedExpressionArray;
}

function getOrderedExpressionSentenceArrayForGender(genderParameter) {
  const orderedExpressionArray = [];
  orderedExpressionArray.push({ expressionText: 'The patient\'s', isExpression: false });
  orderedExpressionArray.push({ expressionText: 'gender', isExpression: false, isType: true });
  orderedExpressionArray.push({ expressionText: 'is', isExpression: false });

  if (genderParameter[0].value) {
    orderedExpressionArray.push({ expressionText: genderParameter[0].value.name, isExpression: true });
  }

  return orderedExpressionArray;
}

function getOrderedExpressionSentenceArrayForParameters(expressionArray, returnType) {
  let orderedExpressionArray = [];
  let remainingExpressionArray = expressionArray;
  orderedExpressionArray.push({ expressionText: 'The value of the', isExpression: false });
  orderedExpressionArray.push({ expressionText: `${_.lowerCase(returnType)}`, isExpression: true });
  orderedExpressionArray.push({ expressionText: 'parameter', isExpression: false, isType: true });
  orderedExpressionArray.push({ expressionText: 'is', isExpression: false });

  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'not') {
      orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
      return false;
    }
    return true;
  });

  orderedExpressionArray.push({ expressionText: 'met', isExpression: false });
  remainingExpressionArray.forEach((expression) => {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
  });

  return orderedExpressionArray;
}

// Build the array for expression phrases by pushing each type of expression in a set order.
function orderExpressionSentenceArray(expressionArray, type, valueSets, codes, returnType, otherParameters) {
  // Specific cases for Age Range, Gender, and Parameters since they do not follow the same pattern as VSAC elements.
  if (type === 'Age Range') {
    return getOrderedExpressionSentenceArrayForAgeRange(expressionArray, otherParameters);
  }
  if (type === 'Gender') {
    // No modifiers can be applied to gender elements
    return getOrderedExpressionSentenceArrayForGender(otherParameters);
  }
  if (type === 'parameter') {
    return getOrderedExpressionSentenceArrayForParameters(expressionArray, returnType);
  }

  let orderedExpressionArray = [];
  const returnsPlural = returnType.includes('list_of_');
  const returnsBoolean = returnType === 'boolean';
  const notExpression = expressionArray.find(expression => expression.type === 'not');
  const existsExpression = expressionArray.find(expression => expression.type === 'BooleanExists');
  const descriptorExpression = expressionArray.find(expression => expression.type === 'descriptor');
  const listExpressions = expressionArray.filter(expression => expression.type === 'list');
  const postListExpressions = expressionArray.find(expression => expression.type === 'post-list');
  const checkExistenceExpression = expressionArray.find((expression) => {
    const nulls = ['is null', 'is not null'];
    return nulls.indexOf(expression.modifierText) !== -1;
  });
  const otherExpressions = expressionArray.filter((expression) => {
    const knownTypes = ['not', 'BooleanExists', 'descriptor', 'list', 'post-list', 'value'];
    return knownTypes.indexOf(expression.type) === -1;
  });
  let hasStarted = false;

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
    orderedExpressionArray.push({ expressionText: 'There exists', isExpression: false });
    hasStarted = true;
  } else if (notExpression) {
    if (checkExistenceExpression) {
      orderedExpressionArray.push({ expressionText: 'It is', isExpression: false });
      orderedExpressionArray.push({ expressionText: 'not', isExpression: true });
      orderedExpressionArray.push({ expressionText: 'the case that', isExpression: false });
      hasStarted = true;
    }
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
        if (!descriptorExpression && index === 0) {
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
  const elementText = _.lowerCase(type);
  const elementArticle = getArticle(elementText);
  if (hasStarted) {
    if (returnsPlural) {
      orderedExpressionArray.push({ expressionText: `${elementText}s`, isExpression: false, isType: true });
    } else if (descriptorExpression || listExpressions.length > 0) {
      orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    } else {
      orderedExpressionArray.push({ expressionText: elementArticle, isExpression: false });
      orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    }
  } else if (returnsPlural) {
    orderedExpressionArray.push({
      expressionText: `${_.capitalize(elementText)}s`,
      isExpression: false,
      isType: true
    });
    hasStarted = true;
  } else {
    orderedExpressionArray.push({ expressionText: _.capitalize(elementArticle), isExpression: false });
    orderedExpressionArray.push({ expressionText: elementText, isExpression: false, isType: true });
    hasStarted = true;
  }

  // Handle value sets and codes
  orderedExpressionArray = addVSandCodeText(orderedExpressionArray, valueSets, codes);

  // Handle post-lists (with unit)
  if (postListExpressions) {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, postListExpressions);
  }

  // Handle any remaining expressions at the end, except concept/quantity value
  otherExpressions.forEach((expression) => {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
  });

  return orderedExpressionArray;
}

export default function convertToExpression(
  expressionsArray = [],
  type,
  valueSets,
  codes,
  returnType,
  otherParameters = []
) {
  const expressionSentenceArray = expressionsArray.reduce((accumulator, currentExpression) => {
    const expressionSentenceValue = getExpressionSentenceValue(currentExpression);
    if (expressionSentenceValue && !_.isEqual(expressionSentenceValue, {})) {
      accumulator.push(expressionSentenceValue);
    }
    return accumulator;
  }, []);

  // Get an order for the expressions that will make sense in a sentence
  const orderedExpressionSentenceArray =
    orderExpressionSentenceArray(expressionSentenceArray, type, valueSets, codes, returnType, otherParameters);

  return orderedExpressionSentenceArray;
}
