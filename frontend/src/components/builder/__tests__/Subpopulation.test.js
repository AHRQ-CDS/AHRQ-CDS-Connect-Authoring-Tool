import React from 'react';
import Subpopulation from '../Subpopulation';
import { render, fireEvent } from '../../../utils/test-utils';
import { createTemplateInstance } from '../../../utils/test_helpers';
import { elementGroups } from '../../../utils/test_fixtures';

const subpopulationName = 'Subpopulation 1';
const subpopulation = {
  id: 'And',
  name: '',
  conjunction: true,
  returnType: 'boolean',
  fields: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
  uniqueId: 'foo123',
  childInstances: [],
  path: '',
  subpopulationName,
  expanded: true
};

describe('<Subpopulation />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Subpopulation
        addInstance={jest.fn()}
        artifact={{}}
        baseElements={[]}
        createTemplateInstance={createTemplateInstance}
        deleteInstance={jest.fn()}
        deleteSubpopulation={jest.fn()}
        editInstance={jest.fn()}
        externalCqlList={[]}
        getAllInstances={jest.fn()}
        getAllInstancesInAllTrees={jest.fn()}
        getVSDetails={jest.fn()}
        instanceNames={[]}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        loadExternalCqlList={jest.fn()}
        loadValueSets={jest.fn()}
        loginVSACUser={jest.fn()}
        modifierMap={{}}
        modifiersByInputType={{}}
        parameters={[]}
        resetCodeValidation={jest.fn()}
        scrollToElement={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setSubpopulationName={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        subpopulation={subpopulation}
        subpopulationIndex={0}
        templates={elementGroups}
        treeName="testtree"
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

  it('starts expanded if expanded property is set to true on subpop object', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.card-element__body')).toHaveLength(1);
  });

  it('can be expanded and collapsed via header', () => {
    const { container, getByLabelText } = renderComponent();

    fireEvent.click(getByLabelText(`hide ${subpopulationName}`));
    expect(container.querySelectorAll('.card-element__body')).toHaveLength(0);

    fireEvent.click(getByLabelText(`show ${subpopulationName}`));
    expect(container.querySelectorAll('.card-element__body')).toHaveLength(1);
  });

  it('calls setSubpopulationName when the subpopulation name is changed', () => {
    const setSubpopulationName = jest.fn();
    const { getByLabelText } = renderComponent({ setSubpopulationName });

    fireEvent.change(getByLabelText('Subpopulation'), { target: { value: 'New name' } });

    expect(setSubpopulationName).toBeCalledWith('New name', subpopulation.uniqueId);
  });

  it('calls deleteSubpopulation when the subpopulation is deleted', () => {
    const deleteSubpopulation = jest.fn();
    const { getByLabelText } = renderComponent({ deleteSubpopulation });

    fireEvent.click(getByLabelText('Remove subpopulation'));

    expect(deleteSubpopulation).toBeCalledWith(subpopulation.uniqueId);
  });
});
