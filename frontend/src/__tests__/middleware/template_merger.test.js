import templateMerger from '../../middleware/template_merger';
import { LOAD_TEMPLATES_SUCCESS } from '../../actions/types';
import { elementGroups } from '../../utils/test_fixtures';

test('Merges template entries', () => {
  const tester = templateMerger()((action) => {
    const template = action.templates[1];
    const extendedEntry = template.entries.find(entry => entry.id === 'GenericObservation');

    expect(extendedEntry.type).toEqual('element');
    expect(extendedEntry.fields[0].name).toEqual('Element Name');
  });

  tester({ type: LOAD_TEMPLATES_SUCCESS, templates: elementGroups });
});
