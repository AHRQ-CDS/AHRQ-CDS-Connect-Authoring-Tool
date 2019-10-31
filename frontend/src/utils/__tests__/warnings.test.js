import _ from 'lodash';
import { hasGroupNestedWarning } from '../warnings';
import mockArtifact from '../../mocks/mockArtifact';
import {
  nestedReturnTypeErrorGroup,
  nestedModifierValidationErrorGroup,
  nestedElementValidationErrorGroup,
  nestedDuplicateElementNamesGroups,
  nestedDuplicateGroupNamesGroups,
  nestedBaseElementUseGroups,
  nonValidatingBaseElementList
} from '../../mocks/mockGroupWarnings';

test('warning for nested return type warning', () => {
  const artifactWithReturnTypeError = _.cloneDeep(mockArtifact);
  artifactWithReturnTypeError.expTreeInclude.childInstances = nestedReturnTypeErrorGroup;
  const treeWithWarnings = artifactWithReturnTypeError.expTreeInclude;
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, [], [], [], [], true);
  expect(warningStatus).toBe(true);
});

test('warning for nested modifier validation warning', () => {
  const artifactWithModifierValidationError = _.cloneDeep(mockArtifact);
  artifactWithModifierValidationError.expTreeInclude.childInstances = nestedModifierValidationErrorGroup;
  const treeWithWarnings = artifactWithModifierValidationError.expTreeInclude;
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, [], [], [], [], true);
  expect(warningStatus).toBe(true);
});

test('warning for nested validate element warning', () => {
  const artifactWithElementValidationError = _.cloneDeep(mockArtifact);
  artifactWithElementValidationError.expTreeInclude.childInstances = nestedElementValidationErrorGroup;
  const treeWithWarnings = artifactWithElementValidationError.expTreeInclude;
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, [], [], [], [], true);
  expect(warningStatus).toBe(true);
});

test('warning for nested duplicate name warning', () => {
  const artifactWithDuplicateNamesError = _.cloneDeep(mockArtifact);
  artifactWithDuplicateNamesError.expTreeInclude.childInstances = nestedDuplicateElementNamesGroups;
  const treeWithWarnings = artifactWithDuplicateNamesError.expTreeInclude;
  const instanceNames = [
    { name: 'Gender1', id: 'Gender-223' },
    { name: 'Gender1', id: 'Gender-233' }
  ];
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, instanceNames, [], [], [], true);
  expect(warningStatus).toBe(true);
});

test('warning for group duplicate name warning', () => {
  const artifactWithDuplicateGroupNamesError = _.cloneDeep(mockArtifact);
  artifactWithDuplicateGroupNamesError.expTreeInclude.childInstances = nestedDuplicateGroupNamesGroups;
  const treeWithWarnings = artifactWithDuplicateGroupNamesError.expTreeInclude;
  const instanceNames = [
    { name: 'Group1a', uniqueId: 'Or-8257' },
    { name: 'Group1a', uniqueId: 'Or-10373' }
  ];
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, instanceNames, [], [], [], true);
  expect(warningStatus).toBe(true);
});

test('warning for nested base element instance warning', () => {
  const artifactWithBaseElementUseError = _.cloneDeep(mockArtifact);
  artifactWithBaseElementUseError.expTreeInclude.childInstances = nestedBaseElementUseGroups;
  const treeWithWarnings = artifactWithBaseElementUseError.expTreeInclude;
  const baseElements = [
    {
      modifiers: [],
      usedBy: ['Gender610-3616'],
      path: '',
      uniqueId: 'Gender-2564',
      fields: [
        { value: 'Gender1', name: 'Element Name', type: 'string', id: 'element_name' },
        {
          value: { value: "'male'", name: 'Male', id: 'male' },
          name: 'Gender',
          select: 'demographics/gender',
          type: 'valueset',
          id: 'gender'
        }
      ],
      validator: {},
      cannotHaveModifiers: true,
      returnType: 'boolean',
      name: 'Gender',
      id: 'Gender'
    }
  ];
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, [], baseElements, [], [], true);
  expect(warningStatus).toBe(true);
});

test('no warning on base element lists (union/intersect) that dont validate type', () => {
  const artifactWithoutValidatingBE = _.cloneDeep(mockArtifact);
  artifactWithoutValidatingBE.baseElements = nonValidatingBaseElementList;
  const treeWithWarnings = artifactWithoutValidatingBE.baseElements[0];
  const isAndOrElement = treeWithWarnings.id === 'And' || treeWithWarnings.id === 'Or';
  const warningStatus = hasGroupNestedWarning(treeWithWarnings.childInstances, [], [], [], [], isAndOrElement);
  expect(warningStatus).toBe(false);
});
