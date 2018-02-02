import _ from 'lodash';
import { LOAD_TEMPLATES_SUCCESS } from '../actions/types';

export default function templateMerger() {
  return next => (action) => {
    if (action.type === LOAD_TEMPLATES_SUCCESS) {
      // get just the template entries
      const entryMap = {};
      action.templates.forEach((template) => {
        template.entries.forEach((entry) => {
          entryMap[entry.id] = entry;
        });
      });

      // for each entry, if it has an extends field, call mergeInParentTemplate
      Object.keys(entryMap).forEach((key) => {
        const entry = entryMap[key];
        if (entry.extends) {
          mergeInParentTemplate(entry, entryMap);
        }
      });
    }

    return next(action);
  };
}

function mergeInParentTemplate(entry, entryMap) {
  // get just the extends field for the given entry
  const parent = entryMap[entry.extends];

  // if the parent extends has its own extends field, call again
  if (parent.extends) {
    // handle transitive
    mergeInParentTemplate(parent, entryMap);
  }

  /* Merge entry fields with parent but remove fields that should not be inherited.
   * This merges the entry into the parent (minus non-inherited fields) so the entry updates the fields
   * it sets itself and inheritance works correctly. Then merge that object back onto entry so that
   * the entry object has the new updated values.
   * ('suppress' is a flag that is specific to an element, it should not be inherited by children)
   */
  _.merge(entry, _.merge(_.omit(_.cloneDeep(parent), ['suppress']), entry));

  // merge parameters
  entry.parameters.forEach((parameter) => {
    const matchingParameter = _.find(parent.parameters, { id: parameter.id });
    _.merge(parameter, matchingParameter);
  });

  const missing = _.differenceBy(parent.parameters, entry.parameters, 'id');
  entry.parameters = missing.concat(entry.parameters); // eslint-disable-line no-param-reassign
}
