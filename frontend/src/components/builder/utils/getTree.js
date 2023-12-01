import { cloneDeep } from 'lodash';

export const getTree = (artifact, treeName, uid = null) => {
  const tree = cloneDeep(artifact[treeName]);
  if (uid == null) {
    return { tree };
  }
  const index = tree.findIndex(e => e.uniqueId === uid);
  return { array: tree, tree: tree[index], index };
};
