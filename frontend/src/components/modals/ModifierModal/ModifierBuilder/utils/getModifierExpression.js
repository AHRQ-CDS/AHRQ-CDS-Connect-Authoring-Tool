import { changeToCase } from 'utils/strings';
import ruleIsComplete from './ruleIsComplete';

const getOperandExpression = (rule, operandId, field) => {
  let expression = '';
  const operand = rule.operator.userSelectedOperands.find(({ id }) => id === operandId);

  if (operand.preLabel) expression = expression.concat(` ${operand.preLabel}`);
  if (operand.selectionValues && operand.selectionValues[0].label)
    expression = expression.concat(
      ` ${changeToCase(
        operand.selectionValues.find(({ value }) => value === rule[operand.id]).label,
        'noCaseWithParens'
      )}`
    );
  else expression = expression.concat(` ${field ? rule[operand.id][field] : changeToCase(rule[operand.id], 'noCase')}`);
  if (operand.postLabel) expression = expression.concat(` ${operand.postLabel}`);

  return expression;
};

const getRuleExpression = rule => {
  let expression = '';

  if (ruleIsComplete(rule) && rule.resourceProperty && rule.operator) {
    // property and operator
    expression = expression.concat(
      `${changeToCase(rule.resourceProperty, 'capitalCase')} ${
        rule.operator.displayName ?? changeToCase(rule.operator.name, 'noCase')
      }`
    );

    // concepts operand
    if (rule.conceptValue || rule.conceptValues?.length > 0) {
      let conceptExpression = '';
      const concepts = rule.conceptValues || [rule.conceptValue];
      concepts.forEach((concept, index) => {
        conceptExpression = conceptExpression.concat(
          concept.display ? `"${concept.display}"` : `${concept.system} ${concept.code}`
        );
        if (index !== concepts.length - 1) conceptExpression = conceptExpression.concat(', ');
      });
      expression = expression.concat(` [${conceptExpression}]`);
    }

    // valueset operand
    if (rule.valueset?.name) expression = expression.concat(` [${rule.valueset.name}]`);

    // codeValue operand
    if (rule.codeValue) {
      let codeValueExpression = '';
      rule.codeValue.forEach((value, index) => {
        codeValueExpression = codeValueExpression.concat(value.inputValue || value);
        if (index < rule.codeValue.length - 1) codeValueExpression = codeValueExpression.concat(', ');
      });
      expression = expression.concat(` [${codeValueExpression}]`);
    }

    // all other operands
    if (!rule.conceptValue && !rule.conceptValues && !rule.valueset && !rule.codeValue) {
      rule.operator?.userSelectedOperands?.forEach(operand => {
        if (rule[operand.id])
          expression = expression.concat(
            ` ${getOperandExpression(rule, operand.id, operand.typeSpecifier?.displayField)}`
          );
      });
    }
  }

  return expression;
};

const getRulesExpression = (rules, conjunctionType) => {
  let expression = '';

  rules.forEach((rule, index) => {
    const isComplete = rule.rules
      ? rule.rules.length > 0 && rule.rules.every(rule => ruleIsComplete(rule))
      : ruleIsComplete(rule);

    const previousIsComplete = rules[index - 1]?.rules
      ? rules[index - 1].rules.every(rule => ruleIsComplete(rule))
      : ruleIsComplete(rule);

    if (rules.length > 1 && index > 0 && isComplete)
      expression = expression.concat(` ${changeToCase(conjunctionType, 'constantCase')} `);

    expression = expression.concat(getRuleExpression(rule));

    if (rule.rules)
      expression = expression.concat(
        `${isComplete && previousIsComplete ? '(' : ''}${getRulesExpression(rule.rules, rule.conjunctionType)}${
          isComplete && previousIsComplete ? ')' : ''
        }`
      );
  });

  return expression;
};

const getModifierExpression = modifierTree => {
  return getRulesExpression(modifierTree.where.rules, modifierTree.where.conjunctionType);
};

export default getModifierExpression;
