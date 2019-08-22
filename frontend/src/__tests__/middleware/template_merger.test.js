import templateMerger from '../../middleware/template_merger';
import { LOAD_TEMPLATES_SUCCESS } from '../../actions/types';
import { elementGroups } from '../../utils/test_fixtures';
import { getFieldWithId } from '../../utils/instances';

test('Merges template entries', () => {
  const tester = templateMerger()((action) => {
    const template = action.templates[1];
    const extendedEntry = template.entries.find(entry => entry.id === 'GenericObservation');
    const extendedEntryNameField = getFieldWithId(extendedEntry.fields, 'element_name');

    expect(extendedEntry.type).toEqual('element');
    expect(extendedEntryNameField.name).toEqual('Element Name');
  });

  tester({ type: LOAD_TEMPLATES_SUCCESS, templates: elementGroups });
});
