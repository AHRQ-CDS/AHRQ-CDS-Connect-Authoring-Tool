import _ from 'lodash';
import { createTemplateInstance, fullRenderComponentOnBody } from '../../../utils/test_helpers';
import { instanceTree, genericInstance, genericInstanceWithModifiers, genericBaseElementInstance,
  genericBaseElementInstanceWithModifiers, genericBaseElementUseInstance } from '../../../utils/test_fixtures';

import TemplateInstance from '../../../components/builder/TemplateInstance';

const originalInstance = instanceTree.childInstances[0];
const genericTemplateInstance = createTemplateInstance(genericInstance);
const genericTemplateInstanceWithModifiers = createTemplateInstance(genericInstanceWithModifiers);
const genericBaseElementUseTemplateInstance = createTemplateInstance(genericBaseElementUseInstance);
const genericBaseElementTemplateInstance = createTemplateInstance(genericBaseElementInstance);
const genericBaseElementTemplateInstanceWithModifers = createTemplateInstance(genericBaseElementInstanceWithModifiers);
let component;
let listComponent;

const props = {
  valueSets: [],
  loadValueSets: jest.fn(),
  getPath: jest.fn(),
  treeName: '',
  templateInstance: genericTemplateInstance,
  otherInstances: [],
  allInstancesInAllTrees: [],
  editInstance: jest.fn(),
  updateInstanceModifiers: jest.fn(),
  deleteInstance: jest.fn(),
  renderIndentButtons: jest.fn(),
  instanceNames: [],
  baseElements: [],
  scrollToBaseElement: jest.fn(),
  loginVSACUser: jest.fn(),
  setVSACAuthStatus: jest.fn(),
  timeLastAuthenticated: new Date(),
  searchVSACByKeyword: jest.fn(),
  isSearchingVSAC: false,
  vsacSearchResults: [],
  vsacSearchCount: 0,
  getVSDetails: jest.fn(),
  isRetrievingDetails: false,
  vsacDetailsCodes: [],
  vsacFHIRCredentials: { username: 'name', password: 'pass' }
};

test('creating a new template instance clones the correct instance', () => {
  const newInstance = createTemplateInstance(originalInstance);
  delete originalInstance.uniqueId;
  delete newInstance.uniqueId;

  expect(newInstance).toEqual(originalInstance);
});

test('creating a new template instance generates unique ID from instance ID name', () => {
  const newInstance = createTemplateInstance(originalInstance);

  expect(newInstance.uniqueId).toMatch(originalInstance.id); // a.k.a. it includes the id prop
});

test('creating a new template instance adds a unique ID', () => {
  const newInstance1 = createTemplateInstance(originalInstance);
  const newInstance2 = createTemplateInstance(originalInstance);

  expect(newInstance1.uniqueId).not.toEqual(newInstance2.uniqueId);
});

describe('vsac controls on generic template instances', () => {
  beforeEach(() => {
    // User fullRenderComponentOnBody to specify mounting the component to document.body.
    // This allows the Tooltip to grab its target correctly.
    component = fullRenderComponentOnBody(
      TemplateInstance,
      { ...props }
    );
  });

  test('are disabled if recently logged in and enabled if not', () => {
    const vsacControls = component.find('#vsac-controls');
    expect(vsacControls.find('.disabled-button')).toHaveLength(1);
    expect(vsacControls.find('ElementModal')).toHaveLength(1);
    expect(vsacControls.find('CodeSelectModal')).toHaveLength(1);
    expect(vsacControls.find('VSACAuthenticationModal')).toHaveLength(0);

    // Change authenticated time to test unathenticated controls.
    component.setProps({ timeLastAuthenticated: new Date(new Date() - 864000000) });
    expect(vsacControls.find('.disabled-button')).toHaveLength(0);
    expect(vsacControls.find('ElementModal')).toHaveLength(0);
    expect(vsacControls.find('CodeSelectModal')).toHaveLength(0);
    expect(vsacControls.find('VSACAuthenticationModal')).toHaveLength(1);
  });

  test('can view value set details from template instance without editing', () => {
    const valueSets = component.props().templateInstance.parameters[1].valueSets;
    // Multiple value sets can be viewed.
    expect(component.find('#valueset-list')).toHaveLength(1);
    expect(component.find('#valueset-list > div')).toHaveLength(2);

    // View the list of selected value sets
    const firstSelectedValueSet = component.find('#valueset-list > div').at(0);
    expect(firstSelectedValueSet.text())
      .toEqual(`Value Set 1: ${valueSets[0].name} (${valueSets[0].oid})`);

    // The selected value set has an icon to open a view only ElementModal to view details
    const elementModal = firstSelectedValueSet.find('ElementModal');
    expect(elementModal).toHaveLength(1);
    expect(elementModal.props().viewOnly).toBeTruthy();
    expect(elementModal.props().useIconButton).toBeTruthy();
    expect(elementModal.props().iconForButton).toEqual('eye');
  });

  test('can delete a value set from a template instance', () => {
    const valueSets = component.props().templateInstance.parameters[1].valueSets;
    expect(valueSets).toHaveLength(2);

    // Multiple value sets can be viewed.
    expect(component.find('#valueset-list')).toHaveLength(1);
    expect(component.find('#valueset-list > div')).toHaveLength(2);

    const firstSelectedValueSet = component.find('#valueset-list > div').at(0);
    const deleteIcon = firstSelectedValueSet.find('#delete-valueset');
    expect(deleteIcon).toHaveLength(1);

    // The array that will be sent to get updated, without valueSets[0] since that is being deleted.
    const arrayToUpdate = [
      { [component.props().templateInstance.parameters[1].id]: [valueSets[1]], attributeToEdit: 'valueSets' }
    ];
    const updateSpy = jest.spyOn(component.instance(), 'updateInstance');
    component.update();
    deleteIcon.simulate('click');
    expect(updateSpy).toBeCalledWith(arrayToUpdate);
  });

  test('can delete a code from a template instance', () => {
    const codes = component.props().templateInstance.parameters[1].codes;
    expect(codes).toHaveLength(2);

    // Multiple codes can be viewed.
    expect(component.find('#code-list')).toHaveLength(1);
    expect(component.find('#code-list > div')).toHaveLength(2);

    const firstSelectedCode = component.find('#code-list > div').at(0);
    const deleteIcon = firstSelectedCode.find('#delete-code');

    // Cannot view or edit codes.
    expect(firstSelectedCode.find('ElementModal')).toHaveLength(0);
    expect(deleteIcon).toHaveLength(1);

    // The array that will be sent to get updated, without codes[0] since that is being deleted.
    const arrayToUpdate = [
      { [component.props().templateInstance.parameters[1].id]: [codes[1]], attributeToEdit: 'codes' }
    ];
    const deleteSpy = jest.spyOn(component.instance(), 'deleteCode');
    const updateSpy = jest.spyOn(component.instance(), 'updateInstance');
    deleteIcon.simulate('click');
    expect(deleteSpy).toBeCalledWith(codes[0]);
    expect(updateSpy).toBeCalledWith(arrayToUpdate);
  });
});

test('renders a collapsed element correctly', () => {
  component = fullRenderComponentOnBody(TemplateInstance, { ...props });

  expect(component.find('.card-element__body')).toHaveLength(1);
  expect(component.find('.card-element__footer')).toHaveLength(1);

  const collapseButton = component.find('.element__hidebutton');
  collapseButton.simulate('click');

  expect(component.find('.card-element__body')).toHaveLength(0);
  expect(component.find('.card-element__footer')).toHaveLength(0);
  expect(component.find('.card-element__header-expression')).toHaveLength(1);
  expect(component.find('.card-element__heading .warning')).toHaveLength(1);
});

describe('Base Element instances', () => {
  beforeEach(() => {
    const baseElementProps = { ...props };
    baseElementProps.templateInstance = genericBaseElementTemplateInstance;
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });
  });

  test('cannot be deleted if in use in the artifact', () => {
    // Used by one element
    expect(component.props().templateInstance.usedBy).toHaveLength(1);

    const deleteSpy = jest.spyOn(component.instance(), 'deleteInstance');
    const propsDeleteSpy = jest.spyOn(component.props(), 'deleteInstance');
    component.update();
    const deleteButton = component.find('.element__deletebutton');

    // Clicking delete button calls the TI's delete function, but not the function passed on props to actually delete it
    deleteButton.simulate('click');
    expect(deleteSpy).toBeCalled();
    expect(propsDeleteSpy).not.toBeCalled();
    expect(deleteButton.hasClass('disabled')).toBeTruthy();
  });

  test('can be deleted if not in use in the artifact', () => {
    // Remove the usage
    const updatedTemplateInstance = genericBaseElementInstance;
    updatedTemplateInstance.usedBy = [];
    component.setProps({ templateInstance: updatedTemplateInstance });
    // Used by no elements
    expect(component.props().templateInstance.usedBy).toHaveLength(0);

    const deleteSpy = jest.spyOn(component.instance(), 'deleteInstance');
    const propsDeleteSpy = jest.spyOn(component.props(), 'deleteInstance');
    component.update();
    const deleteButton = component.find('.element__deletebutton');

    // Can delete instance once no longer used. Calls props deleteInstance to fully delete and no alert created
    deleteButton.simulate('click');
    expect(deleteSpy).toBeCalled();
    expect(propsDeleteSpy).toBeCalled();
    expect(deleteButton.hasClass('disabled')).toBeFalsy();
  });

  test('cannot add modifiers that change the return type if in use in the artifact', () => {
    // Initially used by another element
    expect(component.props().templateInstance.usedBy).toHaveLength(1);

    // Only modifiers that maintain return type are shown
    const addExpressionButton = component.find('.modifier__addbutton');
    addExpressionButton.simulate('click');
    let modifierOptions = component.find('button .modifier__button .secondary-button');
    expect(modifierOptions).toHaveLength(3);

    // Remove the usage
    const updatedTemplateInstance = genericBaseElementInstance;
    updatedTemplateInstance.usedBy = [];
    component.setProps({ templateInstance: updatedTemplateInstance });

    // When no other uses present, all modifiers available again.
    modifierOptions = component.find('button .modifier__button .secondary-button');
    expect(modifierOptions).toHaveLength(7);
  });

  test('cannot remove modifiers that change the return type if in use in the artifact', () => {
    // Use templateInstance with modifiers
    const updatedTemplateInstance = genericBaseElementTemplateInstanceWithModifers;
    component.setProps({ templateInstance: updatedTemplateInstance });

    const removeLastModifierSpy = jest.spyOn(component.instance(), 'removeLastModifier');
    const setAppliedModifiersSpy = jest.spyOn(component.instance(), 'setAppliedModifiers');
    component.update();

    // Initially used by another element
    expect(component.props().templateInstance.usedBy).toHaveLength(1);

    // Initially 3 modifiers applied
    expect(component.props().templateInstance.modifiers).toHaveLength(3);

    // First modifier to delete on hardcoded base element does not change return type. Can be removed.
    let modifierDeleteButton = component.find('.modifier__deletebutton');
    expect(modifierDeleteButton).toHaveLength(1);
    expect(modifierDeleteButton.hasClass('disabled')).not.toBeTruthy();
    modifierDeleteButton.simulate('click');
    expect(removeLastModifierSpy).toHaveBeenLastCalledWith(true);
    let currentAppliedModifiers = component.props().templateInstance.modifiers.slice(0, -1); // All but last modifier
    expect(setAppliedModifiersSpy).toHaveBeenLastCalledWith(currentAppliedModifiers);

    // Update modifiers on the template instance to simulate removing the last modifier
    updatedTemplateInstance.modifiers = currentAppliedModifiers;
    component.setProps({ templateInstance: updatedTemplateInstance });

    // Now only 2 modifiers applied. Last modifier will change return type. Cannot be removed.
    expect(component.props().templateInstance.modifiers).toHaveLength(2);
    modifierDeleteButton = component.find('.modifier__deletebutton');
    expect(modifierDeleteButton).toHaveLength(1);
    expect(modifierDeleteButton.hasClass('disabled')).toBeTruthy();
    modifierDeleteButton.simulate('click');
    expect(removeLastModifierSpy).toHaveBeenLastCalledWith(false);
    currentAppliedModifiers = component.props().templateInstance.modifiers; // All previous modifiers
    expect(setAppliedModifiersSpy).toHaveBeenLastCalledWith(currentAppliedModifiers);
  });
});

describe('Base Element uses', () => {
  beforeEach(() => {
    // Set templateInstance for base element use and set instanceNames to include the original base element name.
    const baseElementProps = { ...props };
    baseElementProps.templateInstance = genericBaseElementUseTemplateInstance;
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'My Base Element' },
      { id: genericBaseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
    ];
    const originalBaseElement = genericBaseElementTemplateInstance;
    originalBaseElement.uniqueId = 'originalBaseElementId';
    baseElementProps.baseElements = [originalBaseElement];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });
  });

  test('have correct color background', () => {
    expect(component.hasClass('base-element')).toBeTruthy();
  });

  test('visualize original base element information', () => {
    const baseElementList = component.find('#base-element-list');
    expect(baseElementList).toHaveLength(1);
    expect(baseElementList.text()).toEqual('Base Element:My Base Element');
  });

  test('can navigate to original definition', () => {
    const linkButton = component.find('.element__linkbutton');
    expect(linkButton).toHaveLength(1);

    linkButton.simulate('click');
    expect(component.props().scrollToBaseElement).toBeCalledWith('originalBaseElementId');
  });
});

describe('Base Element Uses of Use', () => {
  test('use root base element for type and phrase', () => {
    // Set templateInstance for base element use and set instanceNames to include the original base element name.
    const baseElementProps = { ...props };
    const useElement = _.cloneDeep(genericBaseElementUseTemplateInstance);
    useElement.modifiers = [
      {
        id: 'VerifiedObservation',
        name: 'Verified',
        inputTypes: ['list_of_observations'],
        returnType: 'list_of_observations',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'C3F.Verified'
      }
    ];
    useElement.parameters[0].value = 'B';
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'A' },
      { id: 'useOfUseId', name: 'C' },
      { id: useElement.uniqueId, name: 'B' }
    ];
    const originalBaseElement = _.cloneDeep(genericBaseElementTemplateInstance);
    originalBaseElement.uniqueId = 'originalBaseElementId';
    originalBaseElement.parameters[0].value = 'A';
    originalBaseElement.usedBy = [useElement.uniqueId];

    const useOfUseElement = _.cloneDeep(genericBaseElementUseTemplateInstance);
    useOfUseElement.uniqueId = 'useOfUseId';
    useOfUseElement.parameters[0].value = 'C';
    useOfUseElement.parameters[1].value = { id: useElement.uniqueId, type: 'Base Element' };
    useOfUseElement.modifiers = [
      {
        id: 'BooleanExists',
        name: 'Exists',
        inputTypes: ['list_of_observations'],
        returnType: 'boolean',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'exists'
      }
    ];
    useElement.usedBy = [useOfUseElement.uniqueId];
    baseElementProps.baseElements = [originalBaseElement, useElement, useOfUseElement];
    baseElementProps.templateInstance = useOfUseElement;
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    const baseElementList = component.find('#base-element-list');
    expect(baseElementList.text()).toEqual('Base Element:B'); // The base element the use came directly from

    const baseElementHeaderType = component.find('.card-element__heading .label');
    expect(baseElementHeaderType.text()).toEqual('Observation:'); // The topmost base element's type

    const expressionsApplied = component.find('.applied-modifiers__info-expressions .modifier__list');
    expect(expressionsApplied.text()).toEqual('Exists'); // Only the current elements expressions are listed

    const expressionPhrase = component.find('.expression-logic');
    expect(expressionPhrase.text())
      .toEqual('Thereexistsaverifiedobservationwith a code fromVS,VS2,123-4 (TestName),or...'); // All expressions and VS included in the phrase
  });
});

describe('Base Element List instance\'s have child instances inside which', () => {
  beforeEach(() => {
    const baseElementProps = { ...props, renderIndentButtons: jest.fn(), deleteInstance: jest.fn() };
    baseElementProps.templateInstance = genericTemplateInstanceWithModifiers;
    baseElementProps.disableIndent = true; // Used to determine indent/outdent
    baseElementProps.disableElement = true; // Used to determine modifier changes and ability to delete. Changing to False should break last 3 tests.
    listComponent = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });
  });

  test('cannot be indented/outdented ever', () => {
    expect(listComponent.props().renderIndentButtons).not.toBeCalled();
  });

  // Similar test above also tests actually clicking the remove button
  test('cannot remove modifiers that change return type when in use', () => {
    // First modifier can be removed
    let canModifierBeRemoved = listComponent.instance().canModifierBeRemoved();
    expect(canModifierBeRemoved).toBeTruthy();

    // Second modifier cannot be removed
    listComponent.props().templateInstance.modifiers.pop();
    listComponent.update();
    canModifierBeRemoved = listComponent.instance().canModifierBeRemoved();
    expect(canModifierBeRemoved).toBeFalsy();
  });

  // Similar test above shows that correct modifiers are displayed when button clicked
  // The same logic is used to determine notification display and modifiers available
  test('cannot add modifiers that change return type when in use', () => {
    const addExpressionButton = listComponent.find('.modifier__addbutton');
    addExpressionButton.simulate('click');
    expect(listComponent.find('.notification')).toHaveLength(1);
  });

  // Similar test above tests the logic of clicking delete button
  test('cannot be deleted when list in use', () => {
    const deleteSpy = jest.spyOn(listComponent.props(), 'deleteInstance');
    listComponent.instance().deleteInstance();
    expect(deleteSpy).not.toBeCalled();
  });
});

describe('Base Element warnings', () => {
  test('unmodified uses have no warnings', () => {
    // Set up an unmodified base element use
    const baseElementProps = { ...props };
    baseElementProps.templateInstance = _.cloneDeep(genericBaseElementUseTemplateInstance);
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: genericBaseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
    ];
    const originalBaseElement = genericBaseElementTemplateInstance;
    originalBaseElement.uniqueId = 'originalBaseElementId';
    originalBaseElement.parameters[0].value = 'Base Element Observation';
    baseElementProps.baseElements = [originalBaseElement];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    // No warnings on unmodified use
    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(0);
  });

  test('modified uses to have a warning', () => {
    // Set up a modified base element use
    const baseElementProps = { ...props };
    baseElementProps.templateInstance = _.cloneDeep(genericBaseElementUseTemplateInstance);
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: genericBaseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
    ];
    const originalBaseElement = genericBaseElementTemplateInstance;
    originalBaseElement.uniqueId = 'originalBaseElementId';
    originalBaseElement.parameters[0].value = 'Base Element Observation';
    baseElementProps.baseElements = [originalBaseElement];
    baseElementProps.templateInstance.modifiers = [
      {
        id: 'BooleanExists',
        name: 'Exists',
        inputTypes: ['list_of_observations'],
        returnType: 'boolean',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'exists'
      }
    ];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(1);
    expect(warningDiv.text()).toEqual('Warning: This use of the Base Element has changed. Choose another name.');
  });

  test('unmodified uses of uses have no warnings', () => {
    // Set up an unmodified base element use that is also in use
    const baseElementProps = { ...props };
    baseElementProps.templateInstance = _.cloneDeep(genericBaseElementUseTemplateInstance);
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: 'useOfUseId', name: 'Base Element Observation' },
      { id: genericBaseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
    ];
    baseElementProps.templateInstance.usedBy = ['useOfUseId'];

    const originalBaseElement = genericBaseElementTemplateInstance;
    originalBaseElement.uniqueId = 'originalBaseElementId';
    originalBaseElement.parameters[0].value = 'Base Element Observation';
    const useOfUseElement = genericBaseElementUseTemplateInstance;
    useOfUseElement.uniqueId = 'useOfUseId';
    useOfUseElement.parameters[0].value = 'Base Element Observation';

    baseElementProps.baseElements = [originalBaseElement, baseElementProps.templateInstance, useOfUseElement];
    baseElementProps.allInstancesInAllTrees = [originalBaseElement, baseElementProps.templateInstance, useOfUseElement];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    // No warnings on unmodified use
    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(0);
  });

  test('instance with no modified uses to have no warning', () => {
    // Set up an instance and use that is not modified
    const baseElementProps = { ...props };
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: genericBaseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
    ];
    baseElementProps.templateInstance = genericBaseElementTemplateInstance;
    baseElementProps.templateInstance.modifiers = [
      {
        id: 'BooleanExists',
        name: 'Exists',
        inputTypes: ['list_of_observations'],
        returnType: 'boolean',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'exists'
      }
    ];
    baseElementProps.templateInstance.usedBy = [genericBaseElementUseTemplateInstance.uniqueId];
    baseElementProps.allInstancesInAllTrees = [
      genericBaseElementTemplateInstance,
      genericBaseElementUseTemplateInstance
    ];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(0);
  });

  test('instances with modified use to have a warning', () => {
    // Set up an instance and use that is modified
    const baseElementProps = { ...props };
    const modifiedUse = _.cloneDeep(genericBaseElementUseTemplateInstance);
    modifiedUse.modifiers = [
      {
        id: 'BooleanNot',
        name: 'Not',
        inputTypes: ['boolean'],
        returnType: 'boolean',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'not'
      }
    ];
    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: modifiedUse.uniqueId, name: 'Base Element Observation' }
    ];
    baseElementProps.templateInstance = genericBaseElementTemplateInstance;
    baseElementProps.templateInstance.modifiers = [
      {
        id: 'BooleanExists',
        name: 'Exists',
        inputTypes: ['list_of_observations'],
        returnType: 'boolean',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'exists'
      }
    ];

    baseElementProps.templateInstance.usedBy = [modifiedUse.uniqueId];
    baseElementProps.allInstancesInAllTrees = [genericBaseElementTemplateInstance, modifiedUse];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(1);
    expect(warningDiv.text())
      .toEqual('Warning: One or more uses of this Base Element have changed. Choose another name.');
  });

  test('unmodified use with a different element with duplicate name (not a use) has duplicate name warning', () => {
    // Set up an unmodified base element use and another template instance with same name
    const baseElementProps = { ...props };
    const unmodifiedUse = _.cloneDeep(genericBaseElementUseTemplateInstance);
    baseElementProps.templateInstance = unmodifiedUse;

    const tempInstanceWithSameName = _.cloneDeep(genericTemplateInstance);
    tempInstanceWithSameName.parameters[0].value = baseElementProps.templateInstance.parameters[0].value;

    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: unmodifiedUse.uniqueId, name: unmodifiedUse.parameters[0].value },
      { id: tempInstanceWithSameName.uniqueId, name: tempInstanceWithSameName.parameters[0].value }
    ];
    const originalBaseElement = genericBaseElementTemplateInstance;
    originalBaseElement.uniqueId = 'originalBaseElementId';
    originalBaseElement.parameters[0].value = 'Base Element Observation';
    baseElementProps.baseElements = [originalBaseElement];

    baseElementProps.allInstancesInAllTrees = [
      originalBaseElement,
      unmodifiedUse,
      tempInstanceWithSameName
    ];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(1);
    expect(warningDiv.text()).toEqual('Warning: Name already in use. Choose another name.');
  });

  test('unmodified use with another use with same name gives no duplicate name warning', () => {
    // Set up two unmodified uses
    const baseElementProps = { ...props };
    const unmodifiedUse = _.cloneDeep(genericBaseElementUseTemplateInstance);
    baseElementProps.templateInstance = unmodifiedUse;

    const secondUse = _.cloneDeep(genericBaseElementUseTemplateInstance);

    baseElementProps.instanceNames = [
      { id: 'originalBaseElementId', name: 'Base Element Observation' },
      { id: unmodifiedUse.uniqueId, name: unmodifiedUse.parameters[0].value },
      { id: secondUse.uniqueId, name: secondUse.parameters[0].value }
    ];
    const originalBaseElement = genericBaseElementTemplateInstance;
    originalBaseElement.uniqueId = 'originalBaseElementId';
    originalBaseElement.parameters[0].value = 'Base Element Observation';
    originalBaseElement.usedBy = [
      unmodifiedUse.uniqueId,
      secondUse.uniqueId
    ];
    baseElementProps.baseElements = [originalBaseElement];

    baseElementProps.allInstancesInAllTrees = [
      originalBaseElement,
      unmodifiedUse,
      secondUse
    ];
    component = fullRenderComponentOnBody(TemplateInstance, { ...baseElementProps });

    const warningDiv = component.find('.warning');
    expect(warningDiv).toHaveLength(0);
  });
});
