import Subpopulations from '../../../components/builder/Subpopulations';
import Subpopulation from '../../../components/builder/Subpopulation';
import { fullRenderComponent, createTemplateInstance } from '../../../utils/test_helpers';
import { elementGroups } from '../../../utils/test_fixtures';

let component;
let componentWithSubpopulations;
let updateSubpopulations;
let checkSubpopulationUsage;
let updateRecsSubpop;
const userSubpopUniqueId = 'foo123';
const specialSubpop = {
  special: true,
  subpopulationName: "Doesn't Meet Inclusion Criteria",
  special_subpopulationName: 'not "MeetsInclusionCriteria"',
  uniqueId: 'default-subpopulation-1'
};
const fullSubpops = [
  specialSubpop,
  {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    parameters: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
    uniqueId: userSubpopUniqueId,
    childInstances: [],
    path: '',
    subpopulationName: 'Subpopulation 1',
    expanded: true
  }
];

beforeEach(() => {
  updateSubpopulations = jest.fn();
  checkSubpopulationUsage = jest.fn();
  updateRecsSubpop = jest.fn();
  const baseProps = {
    updateSubpopulations,
    templates: elementGroups,
    addInstance: jest.fn(),
    editInstance: jest.fn(),
    updateInstanceModifiers: jest.fn(),
    deleteInstance: jest.fn(),
    getAllInstances: jest.fn(),
    updateRecsSubpop,
    createTemplateInstance,
    checkSubpopulationUsage,
    parameters: [],
    name: '',
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacStatus: '',
    vsacStatusText: '',
    timeLastAuthenticated: new Date(),
    searchVSACByKeyword: jest.fn(),
    isSearchingVSAC: false,
    vsacSearchResults: [],
    vsacSearchCount: 0,
    getVSDetails: jest.fn(),
    isRetrievingDetails: false,
    vsacDetailsCodes: []
  };

  component = fullRenderComponent(Subpopulations, {
    artifact: {
      subpopulations: [specialSubpop]
    },
    ...baseProps
  });

  componentWithSubpopulations = fullRenderComponent(Subpopulations, {
    artifact: {
      subpopulations: fullSubpops
    },
    ...baseProps
  });
});

test('has correct base class', () => {
  component.hasClass('subpopulations');
});

test('filters out "default" subpopulations', () => {
  expect(component.props().artifact.subpopulations).toHaveLength(1);
  expect(component.state().numOfSpecialSubpopulations).toEqual(1);
  expect(component.state().subpopulations).toHaveLength(0);
});

test('can add subpopulations', () => {
  component.find('button').findWhere(button => button.text() === 'New subpopulation').simulate('click');

  const newSubpopulations = updateSubpopulations.mock.calls[0][0];
  const newSubpop = newSubpopulations[newSubpopulations.length - 1];

  expect(updateSubpopulations).toHaveBeenCalledTimes(1);
  expect(newSubpopulations).toHaveLength(2);
  expect(newSubpop.id).toEqual('And');
  expect(newSubpop.subpopulationName).toEqual('Subpopulation 1');
  expect(newSubpop.expanded).toBeTruthy();
});

test('can delete subpopulation not in use', () => {
  checkSubpopulationUsage.mockReturnValueOnce(false);
  expect(componentWithSubpopulations.props().artifact.subpopulations).toHaveLength(2);

  componentWithSubpopulations
    .find(Subpopulation)
    .at(0)
    .find('button')
    .at(1)
    .simulate('click');
  const newSubpopulations = updateSubpopulations.mock.calls[0][0];

  expect(updateSubpopulations).toHaveBeenCalledTimes(1);
  expect(newSubpopulations).toHaveLength(1);
});

test('can\'t delete subpopulation in use', () => {
  checkSubpopulationUsage.mockReturnValueOnce(true);

  componentWithSubpopulations
    .find(Subpopulation)
    .at(0)
    .find('button')
    .at(0)
    .simulate('click');

  expect(updateSubpopulations).not.toHaveBeenCalled();
});

test('can update a subpopulation name', () => {
  const newSubpopName = 'newSubpopName';
  const nameInput = componentWithSubpopulations.find(Subpopulation).at(0).find('input').at(0);

  nameInput.node.value = newSubpopName;
  nameInput.simulate('change');

  const updatedSubpopulation = updateSubpopulations.mock.calls[0][0].find(sp => sp.uniqueId === userSubpopUniqueId);

  expect(updateSubpopulations).toHaveBeenCalledTimes(1);
  expect(updatedSubpopulation.subpopulationName).toEqual(newSubpopName);
  expect(updateRecsSubpop).toHaveBeenCalledWith(newSubpopName, userSubpopUniqueId);
});

test('updates relevant state when new props passed in', () => {
  expect(component.state().subpopulations).toHaveLength(0);
  expect(component.state().numOfSpecialSubpopulations).toEqual(1);

  component.setProps({ artifact: { subpopulations: fullSubpops } });

  expect(component.state().subpopulations).toHaveLength(1);
  expect(component.state().numOfSpecialSubpopulations).toEqual(1);
});
