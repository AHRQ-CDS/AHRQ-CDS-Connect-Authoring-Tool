const operandComplete = (rule, operand) => {
  if (operand.typeSpecifier?.requiredFields)
    return (
      Boolean(rule[operand.id]) && operand.typeSpecifier.requiredFields.every(field => Boolean(rule[operand.id][field]))
    );
  else return Boolean(rule[operand.id]);
};

const ruleIsComplete = rule => {
  const isConjunction = Boolean(rule.conjunctionType);
  const operandsAreComplete = rule.operator?.userSelectedOperands?.every(
    operand =>
      (Array.isArray(rule[operand.id]) && rule[operand.id].length > 0) ||
      (!Array.isArray(rule[operand.id]) && operandComplete(rule, operand))
  );

  if (isConjunction) return rule.rules.length > 0;
  else
    return (
      Boolean(rule.resourceProperty) &&
      Boolean(rule.operator) &&
      (!rule.operator.userSelectedOperands || operandsAreComplete)
    );
};

export default ruleIsComplete;
