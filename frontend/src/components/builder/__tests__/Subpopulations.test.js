import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { createTemplateInstance } from 'utils/test_helpers';
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
        vsacIsAuthenticating={false}
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

    userEvent.click(screen.getByRole('button', { name: 'remove subpopulation' }));
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

    // TODO: Currently Subpopulations protect against deletion by sending an alert
    // message rather than disabling the delete button. This means that the
    // modal still appears and we need to test that it doesn't actually
    // cause deletion. When the Subpopulation and Subpopulations components
    // are refactored, we can make sure that the modal doesn't show up to
    // begin with, and we can make a change here to verify that.
    userEvent.click(screen.getByRole('button', { name: 'remove subpopulation' }));
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(updateSubpopulations).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Subpopulation in use');
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
});
