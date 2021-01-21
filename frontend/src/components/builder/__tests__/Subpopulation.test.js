import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { elementGroups } from 'utils/test_fixtures';
import Subpopulation from '../Subpopulation';

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
        conversionFunctions={[]}
        deleteInstance={jest.fn()}
        deleteSubpopulation={jest.fn()}
        editInstance={jest.fn()}
        externalCqlList={[]}
        getAllInstances={jest.fn()}
        getAllInstancesInAllTrees={jest.fn()}
        instanceNames={[]}
        loadExternalCqlList={jest.fn()}
        modifierMap={{}}
        modifiersByInputType={{}}
        parameters={[]}
        scrollToElement={jest.fn()}
        setSubpopulationName={jest.fn()}
        subpopulation={subpopulation}
        subpopulationIndex={0}
        templates={elementGroups}
        treeName="testtree"
        updateInstanceModifiers={jest.fn()}
        vsaApiKey="key"
        {...props}
      />
    );

  it('starts expanded if expanded property is set to true on subpop object', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.card-element__body')).toHaveLength(1);
  });

  it('can be expanded and collapsed via header', () => {
    const { container } = renderComponent();

    userEvent.click(screen.getByLabelText(`hide ${subpopulationName}`));
    expect(container.querySelectorAll('.card-element__body')).toHaveLength(0);

    userEvent.click(screen.getByLabelText(`show ${subpopulationName}`));
    expect(container.querySelectorAll('.card-element__body')).toHaveLength(1);
  });

  it('calls setSubpopulationName when the subpopulation name is changed', () => {
    const setSubpopulationName = jest.fn();
    renderComponent({ setSubpopulationName });

    fireEvent.change(document.querySelector('input[type=text]'), { target: { value: 'New name' } });

    expect(setSubpopulationName).toBeCalledWith('New name', subpopulation.uniqueId);
  });

  it('calls deleteSubpopulation when the subpopulation is deleted', () => {
    const deleteSubpopulation = jest.fn();
    renderComponent({ deleteSubpopulation });

    userEvent.click(screen.getByRole('button', { name: 'remove subpopulation' }));
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteSubpopulation).toBeCalledWith(subpopulation.uniqueId);
  });
});
