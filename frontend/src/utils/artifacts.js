import _ from 'lodash';
import Validators from './validators';

/**
 * Determines if the artifact is blank (meaning there is no meaningful user-entered information).
 * This is used to determine if an artifact should be auto-saved.
 * WARNING: This function may be fragile to changes.  This should be revisited when Redux is used.
 * @param {Object} artifact - the artifact to check for blankness
 * @return {boolean} true if the artifact has no meaningful data, false otherwise
 */
export function isBlankArtifact(artifact) {
  // If it has an ID, it is pre-existing and considered non-blank
  if (artifact._id) {
    return false;
  }
  // If it has a non-default name or version, it is NOT blank
  if (artifact.name !== 'Untitled Artifact' || artifact.version !== '1') {
    return false;
  }
  // If the counter is above 4, the user must have entered something somewhere.
  // This is probably the fastest detection of many changes, but is not complete.
  if (artifact.uniqueIdCounter > 4) {
    return false;
  }
  // If it has any inclusion elements, it is NOT blank
  if (artifact.expTreeInclude.childInstances && artifact.expTreeInclude.childInstances.length > 0) {
    return false;
  }
  // If it has any exclusion elements, it is NOT blank
  if (artifact.expTreeInclude.childInstances && artifact.expTreeExclude.childInstances.length > 0) {
    return false;
  }
  // If it has more than one recommendation, it is NOT blank
  if (artifact.recommendations.length > 1) {
    return false;
  }
  // If it has only one recommendation, check if it is a blank recommendation
  if (artifact.recommendations.length === 1) {
    const r = artifact.recommendations[0];
    if (r.grade !== 'A' || r.text !== '' || r.rationale !== '' || r.subpopulations.length > 1) {
      return false;
    }
  }
  // If it has more than three subpopulations, it is not blank
  if (artifact.subpopulations.length > 3) {
    return false;
  }
  // If it has exactly three populations, check if the third is a blank population
  // (The first two populations are always hard-coded and un-editable)
  if (artifact.subpopulations.length === 3) {
    const subpop = artifact.subpopulations[2];
    if (subpop.subpopulationName !== 'Subpopulation 1') {
      return false;
    }
    if (subpop.childInstances.length > 0) {
      return false;
    }
  }
  // If it has any parameters, it is NOT blank
  if (artifact.parameters.length > 0) {
    return false;
  }
  // If the error statement has an else clause, it is NOT blank
  if (artifact.errorStatement.elseClause) {
    return false;
  }
  // If it has more than one error statement (else if), it is NOT blank
  if (artifact.errorStatement.statements.length > 1) {
    return false;
  }
  // If it has exactly one error statement, check if it is blank
  if (artifact.errorStatement.statements.length === 1) {
    const st = artifact.errorStatement.statements[0];
    if (st.child !== null || st.thenClause !== '') {
      return false;
    }
    const c = st.condition;
    if (c.label !== null || c.value !== null) {
      return false;
    }
  }
  // If we safely made it here, it is BLANK!
  return true;
}

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
    WithUnit: {
      modifierText: 'with unit', leadingText: '', type: 'post-list'
    },
    ValueComparisonObservation: {
      modifierText: 'greater than a number', leadingText: 'whose value is', type: 'post'
    },
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
    ActiveOrConfirmedAllergyIntolerance: {
      modifierText: 'active or confirmed', leadingText: '', type: 'list'
    },
    MostRecentObservation: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    MostRecentProcedure: { modifierText: 'most recent', leadingText: '', type: 'descriptor' },
    LookBackObservation: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackCondition: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    LookBackMedicationOrder: {
      modifierText: 'look back', leadingText: 'which occurred', type: 'post'
    },
    LookBackMedicationStatement: {
      modifierText: 'look back', leadingText: 'which occurred', type: 'post'
    },
    LookBackProcedure: { modifierText: 'look back', leadingText: 'which occurred', type: 'post' },
    BooleanExists: { modifierText: 'exists', leadingText: 'that', type: 'BooleanExists' },
    BooleanComparison: { modifierText: 'is true', leadingText: 'which', type: 'post' },
    CheckExistence: { modifierText: 'is null', leadingText: 'which', type: 'post' },
    BooleanNot: { modifierText: 'not', leadingText: '', type: 'not' },
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
        expressionSentenceValues[modifier.id].modifierText = `with unit ${modifier.values.unit}`;
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
              valueSetText = modifier.values.code.code;
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
  let otherValueSetsOrCodes = '...';
  let needToAddToTooltipVS = false;
  valueSets.forEach((vs, i) => {
    if (needToAddToTooltipVS) {
      if (i === valueSets.length - 1 && codes.length === 0) {
        // If at the end of the value sets array and there are no codes to add, add 'or' to the text.
        otherValueSetsOrCodes += ` or ${vs.name},`;
      } else {
        otherValueSetsOrCodes += ` ${vs.name},`;
      }
    }
    needToAddToTooltipVS = true;
  });

  let needToAddToTooltipCodes = needToAddToTooltipVS; // If there are value sets added already, all codes go on tooltip
  codes.forEach((code, i) => {
    const display = code.display ? code.display : `${code.code} (${code.codeSystem.name})`;
    if (needToAddToTooltipCodes) {
      if (i === codes.length - 1) {
        // If at the end of the codes array, add 'or' to the text
        otherValueSetsOrCodes += ` or ${display},`;
      } else {
        otherValueSetsOrCodes += ` ${display},`;
      }
    }
    needToAddToTooltipCodes = true;
  });

  if (needToAddToTooltipVS || needToAddToTooltipCodes) { // If there are any value sets or codes to add
    expressionArray.push({ expressionText: 'with code from ', isExpression: false });
    let expressionText;
    if (needToAddToTooltipVS) {
      expressionText = valueSets[0].name;
    } else {
      expressionText = codes[0].display ? codes[0].display : `${codes[0].code} (${codes[0].codeSystem.name})`;
    }
    if (otherValueSetsOrCodes !== '...') { // If there is more than one value set/code, add text for tooltip.
      otherValueSetsOrCodes = otherValueSetsOrCodes.slice(0, -1); // Take off trailing comma
      expressionArray.push({
        expressionText: `${expressionText}...`, isExpression: true, tooltipText: otherValueSetsOrCodes
      });
    } else {
      expressionArray.push({ expressionText, isExpression: true });
    }
  }
  return expressionArray;
}

function addExpressionText(expressionArray, expression) {
  // Add any texted needed ahead of the modifier
  if (expression.leadingText) {
    expressionArray.push({ expressionText: expression.leadingText, isExpression: false });
  }
  // Add the modifier text
  expressionArray.push({ expressionText: expression.modifierText, isExpression: true });
  return expressionArray;
}

// Build the array for expression phrases by pushing each type of expression in a set order.
function orderExpressionSentenceArray(expressionArray, type, valueSets, codes) {
  let remainingExpressionArray = expressionArray;
  let orderedExpressionArray = [];

  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'not') {
      orderedExpressionArray.push({ expressionText: _.capitalize(expression.modifierText), isExpression: true });
      return false;
    }
    return true;
  });

  // Add on descriptors (highest, most recent, etc)
  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'descriptor') {
      orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
      return false; // Filter out the modifier that has been applied.
    }
    return true;
  });

  // Group lists at the beginning of orderedExpressionArray. Filter them off the list of remaining expressions.
  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'list') {
      orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
      return false;
    }
    return true;
  });

  // Add the type of element (Observations, etc)
  orderedExpressionArray.push({ expressionText: type, isExpression: false });

  // Add value sets and codes. If there is more than one value set/code, add the rest to a tooltip.
  orderedExpressionArray = addVSandCodeText(orderedExpressionArray, valueSets, codes);

  // Add post-list types (with unit)
  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'post-list') {
      orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
      return false;
    }
    return true;
  });

  // Add exists
  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'BooleanExists') {
      orderedExpressionArray.push({ expressionText: expression.leadingText, isExpression: false });
      orderedExpressionArray.push({ expressionText: expression.modifierText, isExpression: true });
      return false; // False filters out the exist modifier since it has been added.
    }
    return true; // Modifier not used.
  });

  // Filter out Concept/Quantity value without adding to the phrase.
  remainingExpressionArray = remainingExpressionArray.filter((expression) => {
    if (expression.type === 'value') {
      return false;
    }
    return true;
  });

  // Add any remaining expressions at the end.
  remainingExpressionArray.forEach((expression) => {
    orderedExpressionArray = addExpressionText(orderedExpressionArray, expression);
  });

  // Update the article (a/an) that was added based on the first word in the phrase.
  // If 'not' is applied, the article will follow. Otherwise, it starts the phrase.
  if (expressionArray.findIndex(expression => expression.type === 'not') !== -1) {
    const indexOfArticle = 1;
    const wordToFollow = orderedExpressionArray[indexOfArticle].expressionText;
    const article = getArticle(wordToFollow);
    orderedExpressionArray.splice(indexOfArticle, 0, { expressionText: article, isExpression: false });
  } else {
    const indexOfArticle = 0;
    const wordToFollow = orderedExpressionArray[indexOfArticle].expressionText;
    const article = getArticle(wordToFollow);
    orderedExpressionArray.splice(indexOfArticle, 0, { expressionText: _.capitalize(article), isExpression: false });
  }


  return orderedExpressionArray;
}

export function convertToExpression(expressionsArray, type, valueSets, codes) {
  const expressionSentenceArray = expressionsArray.reduce((accumulator, currentExpression) => {
    if (getExpressionSentenceValue(currentExpression)) {
      const expressionSentenceValue = getExpressionSentenceValue(currentExpression);
      if (!_.isEqual(expressionSentenceValue, {})) {
        accumulator.push(expressionSentenceValue);
      }
    }
    return accumulator;
  }, []);

  // Get an order for the expressions that will make sense in a sentence
  const orderedExpressionSentenceArray = orderExpressionSentenceArray(expressionSentenceArray, type, valueSets, codes);

  return orderedExpressionSentenceArray;

  // // TODO
  // return [
  //   { expressionText: 'There exists a', isExpression: false },
  //   { expressionText: 'most recent', isExpression: true },
  //   { expressionText: 'verified', isExpression: true },
  //   { expressionText: 'observation', isExpression: false },
  //   { expressionText: 'within the last 6 years', isExpression: true },
  //   { expressionText: 'with code from', isExpression: false },
  //   { expressionText: 'Value Set A', isExpression: true },
  //   { expressionText: 'that is', isExpression: false },
  //   { expressionText: 'greater than 130 mg/dL', isExpression: true },
  //   { expressionText: '.', isExpression: false }
  // ];
}
