import React from 'react';
import _ from 'lodash';
import { createTemplateInstance } from 'utils/test_helpers';
import { render, userEvent, screen } from 'utils/test-utils';
import { elementGroups, genericBaseElementUseInstance, genericBaseElementListInstance } from 'utils/test_fixtures';
import { getFieldWithId } from 'utils/instances';
import ListGroup from '../ListGroup';

describe('<ListGroup />', () => {
  const genericBaseElementListTemplateInstance = createTemplateInstance(genericBaseElementListInstance);
  const genericBaseElementUseTemplateInstance = createTemplateInstance(genericBaseElementUseInstance);

  const renderComponent = (props = {}) =>
    render(
      <ListGroup
        addBaseElement={jest.fn()}
        addInstance={jest.fn()}
        artifact={{ baseElements: [genericBaseElementListTemplateInstance] }}
        baseElements={[]}
        deleteInstance={jest.fn()}
        editInstance={jest.fn()}
        externalCqlList={[]}
        getAllInstances={() => genericBaseElementListInstance.childInstances}
        getAllInstancesInAllTrees={() => []}
        getVSDetails={jest.fn()}
        index={0}
        instance={genericBaseElementListTemplateInstance}
        instanceNames={[]}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        loadExternalCqlList={jest.fn()}
        loginVSACUser={jest.fn()}
        modifierMap={{}}
        modifiersByInputType={{}}
        parameters={[]}
        resetCodeValidation={jest.fn()}
        scrollToElement={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        templates={elementGroups}
        treeName="baseElements"
        updateBaseElementLists={jest.fn()}
        updateInstanceModifiers={jest.fn()}
        validateCode={jest.fn()}
        validateReturnType={false}
        vsacApiKey={'key'}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError=""
        vsacIsAuthenticating={false}
        vsacSearchCount={0}
        vsacSearchResults={[]}
        {...props}
      />
    );

  it('cannot be deleted when in use', () => {
    const updateBaseElementLists = jest.fn();
    renderComponent({ updateBaseElementLists });

    expect(screen.getByRole('button', { name: 'remove base element list' })).toBeDisabled();
  });

  it('can be deleted when not in use', () => {
    const updateBaseElementLists = jest.fn();
    const templateInstance = {
      ...genericBaseElementListTemplateInstance,
      usedBy: []
    };

    renderComponent({
      artifact: { baseElements: [templateInstance] },
      instance: templateInstance,
      updateBaseElementLists
    });

    userEvent.click(screen.getByRole('button', { name: 'remove base element list' }));
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(updateBaseElementLists).toBeCalled();
  });

  it('No warnings on base element lists when in use and unmodified', () => {
    const nameField = getFieldWithId(genericBaseElementListTemplateInstance.fields, 'element_name');

    const { container } = renderComponent({
      instanceNames: [
        { id: 'testId1', name: 'UnionListName' },
        { id: genericBaseElementListTemplateInstance.uniqueId, name: nameField.value }
      ]
    });

    expect(container.querySelectorAll('.warning')).toHaveLength(0);
  });

  it('Base Element specific warning on base element list when in use and modified', () => {
    const modifiedUse = _.cloneDeep(genericBaseElementUseTemplateInstance);
    const nameField = getFieldWithId(modifiedUse.fields, 'element_name');

    modifiedUse.uniqueId = 'testId1';
    nameField.value = 'UnionListName';
    modifiedUse.fields.push({
      id: 'comment',
      value: 'foo'
    });

    const { container, getByText } = renderComponent({
      instanceNames: [
        { id: genericBaseElementUseTemplateInstance.uniqueId, name: 'UnionListName' },
        { id: modifiedUse.uniqueId, name: 'UnionListName' }
      ],
      getAllInstancesInAllTrees: () => [genericBaseElementListTemplateInstance, modifiedUse]
    });

    expect(container.querySelectorAll('.warning')).toHaveLength(1);
    expect(
      getByText('Warning: One or more uses of this Base Element have changed. Choose another name.')
    ).toBeInTheDocument();
  });

  describe('#checkReturnTypeCompatibility', () => {
    it('Return Types of Union and Intersect are correctly updated', () => {
      const component = new ListGroup({});
      const { checkReturnTypeCompatibility } = component;

      const observations = checkReturnTypeCompatibility('list_of_observations', 'observation');
      expect(observations).toEqual('list_of_observations');

      const conditions = checkReturnTypeCompatibility('list_of_conditions', 'condition');
      expect(conditions).toEqual('list_of_conditions');

      const obsAndCond = checkReturnTypeCompatibility('list_of_observations', 'list_of_conditions');
      expect(obsAndCond).toEqual('list_of_any');

      const anyAndObs = checkReturnTypeCompatibility('list_of_any', 'list_of_observations');
      expect(anyAndObs).toEqual('list_of_any');

      const boolean = checkReturnTypeCompatibility('list_of_booleans', 'boolean');
      expect(boolean).toEqual('list_of_booleans');
    });
  });

  describe('#checkAndOrReturnTypeCompatibility', () => {
    it('Return Types of And and Or are correctly updated', () => {
      const component = new ListGroup({});
      const { checkAndOrReturnTypeCompatibility } = component;

      const boolAndBool = checkAndOrReturnTypeCompatibility('boolean', 'boolean');
      expect(boolAndBool).toEqual('boolean');

      const observations = checkAndOrReturnTypeCompatibility('list_of_observations', 'observation');
      expect(observations).toEqual('invalid');

      const conditions = checkAndOrReturnTypeCompatibility('list_of_conditions', 'list_of_conditions');
      expect(conditions).toEqual('invalid');

      const conditionsAndBool = checkAndOrReturnTypeCompatibility('list_of_conditions', 'boolean');
      expect(conditionsAndBool).toEqual('invalid');

      const boolAndNone = checkAndOrReturnTypeCompatibility('boolean', 'none');
      expect(boolAndNone).toEqual('boolean');

      const noneAndBool = checkAndOrReturnTypeCompatibility('none', 'boolean');
      expect(noneAndBool).toEqual('boolean');

      const boolAndInvalid = checkAndOrReturnTypeCompatibility('boolean', 'invalid');
      expect(boolAndInvalid).toEqual('invalid');
    });
  });
});
