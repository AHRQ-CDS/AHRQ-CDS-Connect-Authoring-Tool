import React from 'react';
import {prettyDOM} from '@testing-library/react';
import _ from 'lodash';
import ConjunctionGroup from '../../../components/builder/ConjunctionGroup';
import TemplateInstance from '../../../components/builder/TemplateInstance';
import { fullRenderComponent, shallowRenderComponent, createTemplateInstance, fullRenderComponentOnBody }
  from '../../../utils/test_helpers';
import { render, fireEvent } from '../../../utils/test-utils';
import { instanceTree, elementGroups } from '../../../utils/test_fixtures';

describe('<ConjunctionGroup />', () => {
  const operations = elementGroups.find(g => g.name === 'Operations');
  const orTemplate = operations.entries.find(e => e.id === 'Or');
  const andTemplate = operations.entries.find(e => e.id === 'And');
  const orInstance = createTemplateInstance(orTemplate);
  const instance = {
    ...instanceTree,
    path: '',
    childInstances: [
      ...instanceTree.childInstances,
      orInstance
    ]
  };

  const renderComponent = (props = {}) =>
    render(
      <ConjunctionGroup
        addInstance={jest.fn()}
        artifact={{ MeetsInclusionCriteria: { id: 'Or' } }}
        baseElements={[]}
        deleteInstance={jest.fn()}
        editInstance={jest.fn()}
        externalCqlList={[]}
        getAllInstances={() => instance.childInstances}
        getAllInstancesInAllTrees={jest.fn().mockReturnValue([])}
        getVSDetails={jest.fn()}
        instance={instance}
        instanceNames={[]}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        loadExternalCqlList={jest.fn()}
        loadValueSets={jest.fn()}
        loginVSACUser={jest.fn()}
        parameters={[]}
        resetCodeValidation={jest.fn()}
        root={true}
        scrollToElement={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        templates={elementGroups}
        treeName="MeetsInclusionCriteria"
        updateInstanceModifiers={jest.fn()}
        validateCode={jest.fn()}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError=""
        vsacSearchCount={0}
        vsacSearchResults={[]}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('has correct base class', () => {
    const { container } = renderComponent();
    expect(container.firstChild).toHaveClass('card-group');
  });

  it('applies correct nesting classes', () => {
    const { container } = renderComponent();

    const cardGroups = container.querySelectorAll('.card-group');
    expect(cardGroups[0]).toHaveClass('card-group__top');
    expect(cardGroups[2]).toHaveClass('card-group__odd');
  });

  it('adds children at correct tree position', () => {
  });

  it('can delete group', () => {
    const deleteInstance = jest.fn();
    const { container } = renderComponent({ deleteInstance });

    const childConjunction = container.querySelector('.card-group__odd');
    fireEvent.click(childConjunction.querySelector('.card-group__buttons button'));

    expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.2', []);
  });

  it('edits own type', () => {
    const editInstance = jest.fn();
    const { container } = renderComponent({ editInstance });

    const typeSelect = container.querySelector('.card-group__conjunction-select');
    fireEvent.keyDown(typeSelect, { keyCode: 40 });

    const orOption =
      Array.from(container.querySelectorAll('.conjunction-select__option')).find(node => node.textContent === 'Or');
    fireEvent.click(orOption);

    const orType = operations.entries.find(({ id }) => id === 'Or');

    expect(editInstance).toBeCalledWith('MeetsInclusionCriteria', orType, '', true);
  });

  it('edits own name', () => {
    const newName = 'new name';
    const editInstance = jest.fn();

    const { container } = renderComponent({ editInstance });

    const childConjunction = container.querySelector('.card-group__odd');
    const nameField = childConjunction.querySelector('input[name="element_name"]');

    fireEvent.change(nameField, { target: { name: 'element_name', value: newName } });

    expect(editInstance).toBeCalledWith(
      'MeetsInclusionCriteria',
      { element_name: newName },
      '.childInstances.2',
      false
    );
  });
});

describe.skip('skip', () => {
  let rootConjunction;
  let childConjunction;
  let shallowConjunction;
  let deeperConjunction;
  let childConjunctionPath;
  let disabledConjunction;
  let disabledChildConjunction;

  const operations = elementGroups.find(g => g.name === 'Operations');
  const orTemplate = operations.entries.find(e => e.id === 'Or');
  const andTemplate = operations.entries.find(e => e.id === 'And');
  const orInstance = createTemplateInstance(orTemplate);

  instanceTree.path = '';
  instanceTree.childInstances.push(orInstance);

  const getAllInstances = jest.fn();
  getAllInstances.mockReturnValue(instanceTree.childInstances);

  const addInstance = jest.fn();
  const editInstance = jest.fn();
  const deleteInstance = jest.fn();

  const treeName = 'MeetsInclusionCriteria';

  const props = {
    addInstance,
    artifact: { [treeName]: { id: 'Or' } },
    deleteInstance,
    editInstance,
    externalCqlList: [],
    getAllInstances,
    getAllInstancesInAllTrees: jest.fn(),
    getVSDetails: jest.fn(),
    instance: instanceTree,
    instanceNames: [],
    isRetrievingDetails: false,
    isSearchingVSAC: false,
    loadExternalCqlList: jest.fn(),
    loadValueSets: jest.fn(),
    loginVSACUser: jest.fn(),
    parameters: [],
    baseElements: [],
    root: true,
    searchVSACByKeyword: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    templates: elementGroups,
    treeName,
    updateInstanceModifiers: jest.fn(),
    vsacDetailsCodes: [],
    vsacSearchCount: 0,
    vsacSearchResults: [],
    vsacStatus: '',
    vsacStatusText: '',
  };

  beforeEach(() => {
    shallowConjunction = shallowRenderComponent(ConjunctionGroup, props);
    rootConjunction = fullRenderComponent(ConjunctionGroup, props);
    childConjunction = rootConjunction.find(ConjunctionGroup).at(1); // The 'Or' instance pushed into tree above
    childConjunctionPath = childConjunction.node.getPath();
  });

  afterEach(() => {
    addInstance.mockClear();
    editInstance.mockClear();
    deleteInstance.mockClear();
  });

  test('can\'t indent or outdent root group', () => {
    expect(shallowConjunction.find('.indent-outdent-container')).toHaveLength(0);
  });

  test('can indent a child group', () => {
    childConjunction.find('button[aria-label="indent"]').simulate('click');

    const instance = createTemplateInstance(andTemplate, [childConjunction.node.props.instance]);
    const path = childConjunctionPath.split('.').slice(0, -2).join('.');
    const index = Number(childConjunctionPath.split('.').pop());

    delete instance.uniqueId;
    delete deleteInstance.mock.calls[0][2][0].instance.uniqueId;

    expect(deleteInstance).toHaveBeenCalledWith(treeName, childConjunctionPath, [{ instance, path, index }]);
  });

  test('can outdent a child group', () => {
    childConjunction.find('button[aria-label="outdent"]').simulate('click');

    expect(deleteInstance).toHaveBeenCalledWith(treeName, childConjunctionPath, []);
  });

  test('has an expression phrase', () => {
    const childGroupProps = _.cloneDeep(props);
    const childGroupInstanceTree = _.cloneDeep(instanceTree);
    childGroupInstanceTree.childInstances.push(_.cloneDeep(instanceTree));
    childGroupProps.instance = childGroupInstanceTree;
    const childGroupConjunction = fullRenderComponentOnBody(ConjunctionGroup, childGroupProps);
    expect(childGroupConjunction.find('.expression__group')).toHaveLength(1);
  });

  describe('for deeper nested conjunction groups', () => {
    beforeEach(() => {
      const ageInstance = createTemplateInstance(elementGroups[0].entries[0]);
      const deeperOr = _.cloneDeep(orInstance);
      deeperOr.childInstances = [ageInstance];
      const deeperTree = _.cloneDeep(instanceTree);
      deeperTree.childInstances = [deeperOr];
      const deeperProps = _.cloneDeep(props);
      deeperProps.instance = deeperTree;
      deeperConjunction = fullRenderComponentOnBody(ConjunctionGroup, deeperProps);
      childConjunction = deeperConjunction.find(ConjunctionGroup).at(1);
    });

    // TODO: All the following should really verify what they were called with as well

    test('can indent a child group', () => {
      childConjunction.find('button[aria-label="indent"]').at(0).simulate('click');

      expect(deleteInstance).toHaveBeenCalled();
    });

    test('can outdent a child group', () => {
      childConjunction.find('button[aria-label="outdent"]').at(0).simulate('click');

      expect(deleteInstance).toHaveBeenCalled();
    });

    test('can indent a child TemplateInstance', () => {
      deeperConjunction
        .find(TemplateInstance)
        .first()
        .find('button[aria-label="indent"]')
        .first()
        .simulate('click');

      expect(deleteInstance).toHaveBeenCalled();
    });

    test('can outdent a child TemplateInstance', () => {
      deeperConjunction
        .find(TemplateInstance)
        .first()
        .find('button[aria-label="outdent"]')
        .first()
        .simulate('click');

      expect(deleteInstance).toHaveBeenCalled();
    });
  });

  describe('conjunctions that are in base elements in use', () => {
    beforeEach(() => {
      const disableElementProps = _.cloneDeep(props);
      disableElementProps.disableElement = true;
      disabledConjunction = fullRenderComponentOnBody(ConjunctionGroup, disableElementProps);
      disabledChildConjunction = disabledConjunction.find(ConjunctionGroup).at(1);
    });

    test('cannot delete main or nested conjunctions', () => {
      expect(disabledConjunction.props().disableElement).toBeTruthy();

      const deleteSpy = jest.spyOn(disabledConjunction.instance(), 'deleteInstance');
      const propsDeleteSpy = jest.spyOn(disabledChildConjunction.props(), 'deleteInstance');
      disabledConjunction.update();
      const deleteButton = disabledConjunction.find('.card-group__buttons .element__deletebutton');

      // Deleting calls the CG's delete function, but not the function passed on props to actually delete it
      disabledConjunction.instance().deleteInstance();
      expect(deleteSpy).toBeCalled();
      expect(propsDeleteSpy).not.toBeCalled();
      expect(deleteButton.hasClass('disabled')).toBeTruthy();

      deleteSpy.mockClear();
      propsDeleteSpy.mockClear();
    });

    test('cannot indent or outdent nested conjunctions', () => {
      const indentButton = disabledChildConjunction.find('button[aria-label="indent"]');
      const outdentButton = disabledChildConjunction.find('button[aria-label="outdent"]');

      indentButton.simulate('click');
      expect(deleteInstance).not.toBeCalled();
      outdentButton.simulate('click');
      expect(deleteInstance).not.toBeCalled();
    });
  });
});
