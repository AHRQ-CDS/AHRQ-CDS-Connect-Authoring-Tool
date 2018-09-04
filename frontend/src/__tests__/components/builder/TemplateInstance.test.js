import { createTemplateInstance, fullRenderComponentOnBody } from '../../../utils/test_helpers';
import { instanceTree, genericInstance } from '../../../utils/test_fixtures';

import TemplateInstance from '../../../components/builder/TemplateInstance';

const originalInstance = instanceTree.childInstances[0];
const genericTemplateInstance = createTemplateInstance(genericInstance);
let component;

const props = {
  valueSets: [],
  loadValueSets: jest.fn(),
  getPath: jest.fn(),
  treeName: '',
  templateInstance: genericTemplateInstance,
  otherInstances: [],
  editInstance: jest.fn(),
  updateInstanceModifiers: jest.fn(),
  deleteInstance: jest.fn(),
  renderIndentButtons: jest.fn(),
  instanceNames: [],
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
