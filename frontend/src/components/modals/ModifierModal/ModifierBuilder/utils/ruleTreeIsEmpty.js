const allChildrenAreEmpty = node => {
  // Rule is conjunction and has children
  if (node.conjunctionType) return node.rules?.every(rule => allChildrenAreEmpty(rule));
  // Rule is a leaf node
  else return !(node.resourceProperty && node.operator && Boolean(node.operator.id));
};

export const ruleTreeIsEmpty = root => {
  return allChildrenAreEmpty(root.where);
};
