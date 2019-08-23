import templateMerger from '../../middleware/template_merger';
import { LOAD_TEMPLATES_SUCCESS } from '../../actions/types';
import { getFieldWithId, getFieldWithType } from '../../utils/instances';

const formTemplateMock = [
  {
    id: 0,
    icon: 'user',
    suppress: true,
    name: 'Generic',
    entries: [
      {
        id: 'Base',
        name: 'Base Template',
        type: 'element',
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' }
        ],
      }
    ]
  },
  {
    id: 2,
    icon: 'eye',
    name: 'Observations',
    entries: [
      {
        id: 'GenericObservation_vsac',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        template: 'GenericObservation',
        suppressedModifiers: ['ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
        fields: [
          { id: 'observation', type: 'observation_vsac', name: 'Observation' }
        ]
      },
    ]
  }
];

test('Merges template entries', () => {
  const tester = templateMerger()((action) => {
    const template = action.templates[1];
    const extendedEntry = template.entries.find(entry => entry.id === 'GenericObservation_vsac');
    const extendedEntryNameField = getFieldWithId(extendedEntry.fields, 'element_name');
    const extendedEntryVsacField = getFieldWithType(extendedEntry.fields, '_vsac');
    const extendedEntryCommentField = getFieldWithId(extendedEntry.fields, 'comment');

    expect(extendedEntryNameField.name).toEqual('Element Name');
    expect(extendedEntryVsacField.name).toEqual('Observation');

    // This is the expected order of fields after merging.
    // However, no other references to specific indexes should exist in the code.
    expect(extendedEntry.fields[0]).toEqual(extendedEntryNameField);
    expect(extendedEntry.fields[1]).toEqual(extendedEntryCommentField);
    expect(extendedEntry.fields[2]).toEqual(extendedEntryVsacField);

    // Gains fields based on parent due to extension. Overwrites any properties it specifies itself
    expect(extendedEntry.type).toEqual('element'); // An inherited property from the parent
    expect(extendedEntry.name).toEqual('Observation'); // An overwritten property on the child
    expect(extendedEntry.template).toEqual('GenericObservation'); // A new property defined on the child
  });

  tester({ type: LOAD_TEMPLATES_SUCCESS, templates: formTemplateMock });
});
