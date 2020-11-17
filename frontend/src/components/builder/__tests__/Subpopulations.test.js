import React from 'react';
import Subpopulations from '../Subpopulations';
import { render, fireEvent } from '../../../utils/test-utils';
import { createTemplateInstance } from '../../../utils/test_helpers';
import { elementGroups } from '../../../utils/test_fixtures';

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
        artifact={{
          subpopulations: [specialSubpop]
        }}
        baseElements={[]}
        checkSubpopulationUsage={jest.fn()}
        createTemplateInstance={createTemplateInstance}
        deleteInstance={jest.fn()}
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
        name="subpopulations"
        parameters={[]}
        resetCodeValidation={jest.fn()}
        scrollToElement={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        templates={elementGroups}
        updateInstanceModifiers={jest.fn()}
        updateRecsSubpop={jest.fn()}
        updateSubpopulations={jest.fn()}
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
    const { getByLabelText } = renderComponent({ updateSubpopulations });

    fireEvent.click(getByLabelText('New subpopulation'));

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

  it('can delete subpopulation not in use', () => {
    const checkSubpopulationUsage = jest.fn().mockReturnValueOnce(false);
    const updateSubpopulations = jest.fn();

    const { getByLabelText } = renderComponent({
      artifact: {
        subpopulations: [specialSubpop, subpopulation]
      },
      checkSubpopulationUsage,
      updateSubpopulations
    });

    fireEvent.click(getByLabelText('Remove subpopulation'));

    expect(updateSubpopulations).toHaveBeenCalledWith(
      [specialSubpop],
      'subpopulations'
    );
  });

  it('can\'t delete subpopulation in use', () => {
    const checkSubpopulationUsage = jest.fn().mockReturnValueOnce(true);
    const updateSubpopulations = jest.fn();

    const { getByLabelText } = renderComponent({
      artifact: {
        subpopulations: [specialSubpop, subpopulation]
      },
      checkSubpopulationUsage,
      updateSubpopulations
    });

    fireEvent.click(getByLabelText('Remove subpopulation'));

    expect(updateSubpopulations).not.toHaveBeenCalled();
  });

  it('can update a subpopulation name', () => {
    const newSubpopName = 'newSubpopName';
    const updateRecsSubpop = jest.fn();
    const updateSubpopulations = jest.fn();

    const { getByLabelText } = renderComponent({
      artifact: {
        subpopulations: [specialSubpop, subpopulation]
      },
      updateRecsSubpop,
      updateSubpopulations
    });

    fireEvent.change(getByLabelText('Subpopulation'), { target: { value: newSubpopName }});

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
});
