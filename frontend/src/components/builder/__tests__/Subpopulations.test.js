import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, fireEvent, userEvent, screen, waitFor, PointerEventsCheckLevel } from 'utils/test-utils';
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
  const renderComponent = ({
    recommendations = [],
    subpopulations = [specialSubpop],
    updateSubpopulations = jest.fn(),
    ...props
  } = {}) =>
    render(
      <Provider
        store={createStore(x => x, { artifacts: { artifact: { ...mockArtifact, subpopulations, recommendations } } })}
      >
        <Subpopulations
          addInstance={jest.fn()}
          deleteInstance={jest.fn()}
          editInstance={jest.fn()}
          updateInstanceModifiers={jest.fn()}
          updateSubpopulations={updateSubpopulations}
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

  it('can add subpopulations', async () => {
    const updateSubpopulations = jest.fn();
    renderComponent({ updateSubpopulations });

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'New subpopulation' })));

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

  it('can update a subpopulation name', async () => {
    const newSubpopulationName = 'New Subpopulation Name v2.0';
    const updateSubpopulations = jest.fn();
    const subpopulations = [specialSubpop, subpopulation];

    const { container } = renderComponent({
      subpopulations,
      updateSubpopulations
    });

    await waitFor(() => {
      return fireEvent.change(container.querySelector('input[type=text]'), { target: { value: newSubpopulationName } });
    });

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

  it('can delete subpopulation not in use', async () => {
    const updateSubpopulations = jest.fn();
    const subpopulations = [specialSubpop, subpopulation];

    const { getByRole } = renderComponent({
      recommendations: [{ text: 'Talk to dr.', subpopulations: [] }], // doesn't use any subpopulation
      subpopulations,
      updateSubpopulations
    });

    await waitFor(() => userEvent.click(getByRole('button', { name: 'delete Subpopulation' }))); // delete button on subpopulation
    await waitFor(() => userEvent.click(getByRole('button', { name: 'Delete' })));

    expect(updateSubpopulations).toHaveBeenCalledWith([specialSubpop], 'subpopulations', true);
  });

  it("can't delete subpopulation or edit its name when used by a recommendation", async () => {
    const updateSubpopulations = jest.fn();
    const subpopulations = [specialSubpop, subpopulation];

    const { getByRole } = renderComponent({
      recommendations: [
        { text: 'Talk to dr.', subpopulations: [{ subpopulationName: 'Subpopulation 1', uniqueId: 'foo123' }] } // uses a subpopulation
      ],
      subpopulations,
      updateSubpopulations
    });

    await waitFor(() => {
      return userEvent.click(getByRole('button', { name: 'delete Subpopulation' }), {
        pointerEventsCheck: PointerEventsCheckLevel.Never
      });
    });

    expect(updateSubpopulations).not.toHaveBeenCalled();

    // Delete button on subpopulation is disabled
    expect(getByRole('button', { name: 'delete Subpopulation' })).toBeDisabled();
    // Title text field on subpopulation is disabled
    expect(getByRole('textbox')).toBeDisabled();
  });
});
