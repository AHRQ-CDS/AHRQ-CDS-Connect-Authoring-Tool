const getAllChildrenEmpty = node => {
  // Rule is conjunction and has children
  if (node.conjunctionType) {
    return node?.rules?.reduce((acc, rule) => acc || getAllChildrenEmpty(rule), false);
  }
  // Rule is a leaf node.
  else {
    return node.resourceProperty !== undefined && node.ruleType !== undefined;
  }
};

export const getIsRuleTreeEmpty = root => {
  return getAllChildrenEmpty(root.where);
};
