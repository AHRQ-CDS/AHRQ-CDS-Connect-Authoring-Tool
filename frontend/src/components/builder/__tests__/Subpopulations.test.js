import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { elementGroups } from 'utils/test_fixtures';
import Subpopulations from '../Subpopulations';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';

const subpopulation = {
  id: 'And',
  name: '',
  conjunction: true,
  returnType: 'boolean',
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name' },
    { id: 'comment', type: 'string', name: 'Comment' }
  ],
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
      <Provider store={createStore(x => x, { artifacts: { artifact: mockArtifact } })}>
        <Subpopulations
          addInstance={jest.fn()}
          artifact={{ subpopulations: [specialSubpop], recommendations: [] }}
          baseElements={[]}
          deleteInstance={jest.fn()}
          editInstance={jest.fn()}
          getAllInstancesInAllTrees={jest.fn()}
          instanceNames={[]}
          isLoadingModifiers={false}
          modifiersByInputType={{}}
          parameters={[]}
          subpopulations={[specialSubpop]}
          templates={elementGroups}
          updateInstanceModifiers={jest.fn()}
          updateSubpopulations={jest.fn()}
          vsacApiKey="key"
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates);
  });

  afterEach(() => nock.cleanAll());

  afterAll(() => nock.restore());

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
    const { queryAllByText } = renderComponent();

    expect(queryAllByText('Subpopulation:')).toHaveLength(0);
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
    const newSubpopulationName = 'New Subpopulation Name v2.0';
    const updateSubpopulations = jest.fn();
    const subpopulations = [specialSubpop, subpopulation];

    const { container } = renderComponent({
      artifact: { subpopulations, recommendations: [] },
      subpopulations,
      updateSubpopulations
    });

    fireEvent.change(container.querySelector('input[type=text]'), { target: { value: newSubpopulationName } });

    expect(updateSubpopulations).toHaveBeenCalledWith(
      [
        specialSubpop,
        expect.objectContaining({
          subpopulationName: newSubpopulationName
        })
      ],
      'subpopulations'
    );
  });

  it('can delete subpopulation not in use', () => {
    const updateSubpopulations = jest.fn();
    const subpopulations = [specialSubpop, subpopulation];

    const { getByRole } = renderComponent({
      artifact: {
        subpopulations,
        recommendations: [{ text: 'Talk to dr.', subpopulations: [] }] // doesn't use any subpopulation
      },
      subpopulations,
      updateSubpopulations
    });

    userEvent.click(getByRole('button', { name: 'delete Subpopulation' })); // delete button on subpopulation
    userEvent.click(getByRole('button', { name: 'Delete' })); // modal delete

    expect(updateSubpopulations).toHaveBeenCalledWith([specialSubpop], 'subpopulations', true);
  });

  it("can't delete subpopulation or edit its name when used by a recommendation", () => {
    const updateSubpopulations = jest.fn();
    const subpopulations = [specialSubpop, subpopulation];

    const { getByRole } = renderComponent({
      artifact: {
        subpopulations,
        recommendations: [
          { text: 'Talk to dr.', subpopulations: [{ subpopulationName: 'Subpopulation 1', uniqueId: 'foo123' }] } // uses a subpopulation
        ]
      },
      subpopulations,
      updateSubpopulations
    });

    userEvent.click(getByRole('button', { name: 'delete Subpopulation' }), undefined, { skipPointerEventsCheck: true });
    expect(updateSubpopulations).not.toHaveBeenCalled();

    // Delete button on subpopulation is disabled
    expect(getByRole('button', { name: 'delete Subpopulation' })).toBeDisabled();
    // Title text field on subpopulation is disabled
    expect(getByRole('textbox')).toBeDisabled();
  });
});
