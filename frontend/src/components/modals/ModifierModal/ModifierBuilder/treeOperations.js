import _ from 'lodash';

// Adds a (sibling) rule to the current node's rule array.
export const addRule = (currentNode, updateCurrentNode) => {
  let updatedNode = _.cloneDeep(currentNode);
  updatedNode.rules.push({ resourceProperty: '', ruleType: '' });
  updateCurrentNode(updatedNode);
};

// Adds a (child) group to the current node's rule array.
export const addGroup = (currentNode, updateCurrentNode) => {
  let updatedNode = _.cloneDeep(currentNode);
  updatedNode.rules.push({ conjunctionType: 'and', rules: [] });
  updateCurrentNode(updatedNode);
};

// Remove a child/sibling rule/group from current node's rule array.
export const removeRuleByIndex = (currentNode, updateCurrentNode, index) => {
  let updatedNode = _.cloneDeep(currentNode);
  updatedNode.rules.splice(index, 1);
  updateCurrentNode(updatedNode);
};

// Update a rule within the current node's rule array by index.
// Here we update the ruleType (operator Id) field.
export const updateRuleType = (currentNode, updateCurrentNode, index, ruleType) => {
  let updatedNode = _.cloneDeep(currentNode);
  updatedNode.rules[index].ruleType = ruleType;
  updateCurrentNode(updatedNode);
};

// Update the current node's conjunction statement.
export const updateConjunctionValue = (currentNode, updateCurrentNode) => {
  let updatedNode = _.cloneDeep(currentNode);
  updatedNode.conjunctionType = updatedNode.conjunctionType === 'and' ? 'or' : 'and';
  updateCurrentNode(updatedNode);
};

// Create a callback that will edit one rule by index in the current node's rule array.
// This is essentially how updating the tree becomes recursive. A change beneath creates a change above.
export const createChildCallback = (currentNode, updateCurrentNode, childIndex, value) => {
  let updatedNode = _.cloneDeep(currentNode);
  updatedNode.rules[childIndex] = value;
  updateCurrentNode(updatedNode);
};
