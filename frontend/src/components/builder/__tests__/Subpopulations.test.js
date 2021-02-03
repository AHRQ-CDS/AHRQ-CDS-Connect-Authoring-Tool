import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { elementGroups } from 'utils/test_fixtures';
import Subpopulations from '../Subpopulations';

const subpopulation = {
  id: 'And',
  name: '',
  conjunction: true,
  returnType: 'boolean',
  fields: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
  uniqueId: 'foo123',
  childInstances: [],
  path: '',
  subpopulationName: 'Subpopulation 1',
  expanded: true
};

const specialSubpop = {
  special: true,
  subpopulationName: "Doesn't Meet Inclusion Criteria",
  special_subpopulationName: 'not "MeetsInclusionCriteria"',
  uniqueId: 'default-subpopulation-1'
};

describe('<Subpopulations />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Subpopulations
        addInstance={jest.fn()}
        artifact={{ subpopulations: [specialSubpop] }}
        baseElements={[]}
        checkSubpopulationUsage={jest.fn()}
        conversionFunctions={[]}
        deleteInstance={jest.fn()}
        editInstance={jest.fn()}
        externalCqlList={[]}
        getAllInstances={jest.fn()}
        getAllInstancesInAllTrees={jest.fn()}
        instanceNames={[]}
        isLoadingModifiers={false}
        loadExternalCqlList={jest.fn()}
        modifierMap={{}}
        modifiersByInputType={{}}
        name="subpopulations"
        parameters={[]}
        scrollToElement={jest.fn()}
        templates={elementGroups}
        updateInstanceModifiers={jest.fn()}
        updateRecsSubpop={jest.fn()}
        updateSubpopulations={jest.fn()}
        validateReturnType={false}
        vsacApiKey="key"
        {...props}
      />
    );

  let origAlert;
  beforeEach(() => {
    origAlert = window.alert;
    window.alert = jest.fn();
  });
  afterEach(() => {
    window.alert = origAlert;
    origAlert = null;
  });

  it('filters out "default" subpopulations', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.subpopulation')).toHaveLength(0);
  });

  it('can add subpopulations', () => {
    const updateSubpopulations = jest.fn();
    renderComponent({ updateSubpopulations });

    userEvent.click(screen.getByRole('button', { name: 'New subpopulation' }));

    expect(updateSubpopulations).toHaveBeenCalledWith(
      [
        specialSubpop,
        expect.objectContaining({
          id: 'And',
          subpopulationName: 'Subpopulation 1',
          expanded: true
        })
      ],
      'subpopulations'
    );
  });

  it('can update a subpopulation name', () => {
    const newSubpopName = 'newSubpopName';
    const updateRecsSubpop = jest.fn();
    const updateSubpopulations = jest.fn();

    renderComponent({
      artifact: {
        subpopulations: [specialSubpop, subpopulation]
      },
      updateRecsSubpop,
      updateSubpopulations
    });

    fireEvent.change(document.querySelector('input[type=text]'), { target: { value: newSubpopName } });

    expect(updateSubpopulations).toHaveBeenCalledWith(
      [
        specialSubpop,
        expect.objectContaining({
          subpopulationName: newSubpopName
        })
      ],
      'subpopulations'
    );

    expect(updateRecsSubpop).toHaveBeenCalledWith(newSubpopName, subpopulation.uniqueId);
  });

  it('can delete subpopulation not in use', () => {
    const checkSubpopulationUsage = jest.fn().mockReturnValueOnce(false);
    const updateSubpopulations = jest.fn();

    renderComponent({
      artifact: {
        subpopulations: [specialSubpop, subpopulation]
      },
      checkSubpopulationUsage,
      updateSubpopulations
    });

    userEvent.click(screen.getByRole('button', { name: 'delete subpopulation' }));
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(updateSubpopulations).toHaveBeenCalledWith([specialSubpop], 'subpopulations');
  });

  it("can't delete subpopulation in use", () => {
    const checkSubpopulationUsage = jest.fn().mockReturnValueOnce(true);
    const updateSubpopulations = jest.fn();

    renderComponent({
      artifact: {
        subpopulations: [specialSubpop, subpopulation]
      },
      checkSubpopulationUsage,
      updateSubpopulations
    });

    userEvent.click(screen.getByRole('button', { name: 'delete subpopulation' }));

    expect(updateSubpopulations).not.toHaveBeenCalled();
  });
});
