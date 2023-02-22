import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { elementGroups } from 'utils/test_fixtures';
import Subpopulation from '../Subpopulation';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';
import { getSubpopulationErrors, hasGroupNestedWarning } from 'utils/warnings';

const subpopulationName = 'First Subpopulation';
const subpopulation = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name' },
    { id: 'comment', type: 'string', name: 'Comment' }
  ],
  uniqueId: 'foo123',
  childInstances: [],
  path: '',
  subpopulationName,
  expanded: true
};

describe('<Subpopulation />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact: mockArtifact }, vsac: { apiKey: 'api-123' } })}>
        <Subpopulation
          addInstance={jest.fn()}
          alerts={[]}
          artifact={{}}
          baseElements={[]}
          deleteInstance={jest.fn()}
          disableDeleteSubpopulationElement={false}
          editInstance={jest.fn()}
          getAllInstancesInAllTrees={jest.fn(() => [])} // return empty array of instances
          handleDeleteSubpopulationElement={jest.fn()}
          handleUpdateSubpopulationElement={jest.fn()}
          hasErrors={false}
          instanceNames={[]}
          isLoadingModifiers={false}
          modifiersByInputType={{}}
          parameters={[]}
          subpopulation={subpopulation}
          subpopulationUniqueId={0}
          templates={elementGroups}
          updateInstanceModifiers={jest.fn()}
          vsaApiKey="key"
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

  it('starts expanded if expanded property is set to true on subpopulation object', () => {
    const { getByText } = renderComponent();

    expect(getByText('Subpopulation:')).toBeInTheDocument();
  });

  it('can be expanded and collapsed via header', () => {
    const { queryByText, getByText } = renderComponent();

    userEvent.click(screen.queryAllByRole('button', { name: /collapse/i })[0]);
    expect(queryByText('Subpopulation:')).not.toBeInTheDocument(); // Type is displayed next to title text box
    expect(getByText('First Subpopulation:')).toBeInTheDocument(); // Title is displayed when collapsed

    userEvent.click(screen.queryAllByRole('button', { name: /expand/i })[0]);
    expect(getByText('Subpopulation:')).toBeInTheDocument(); // Type is displayed next to title text box
    expect(queryByText('First Subpopulation:')).not.toBeInTheDocument(); // Title is not displayed when expanded
  });

  it('calls handleUpdateSubpopulationElement when the subpopulation name is changed', () => {
    const handleUpdateSubpopulationElement = jest.fn();
    const { container } = renderComponent({ handleUpdateSubpopulationElement });

    fireEvent.change(container.querySelector('input[type=text]'), { target: { value: 'New name' } });

    expect(handleUpdateSubpopulationElement).toBeCalledWith('New name', subpopulation.uniqueId);
  });

  it('calls handleDeleteSubpopulationElement when the subpopulation is deleted', () => {
    const handleDeleteSubpopulationElement = jest.fn();
    const { getByRole } = renderComponent({ handleDeleteSubpopulationElement });

    userEvent.click(getByRole('button', { name: 'delete Subpopulation' })); // delete button on subpopulation
    userEvent.click(getByRole('button', { name: 'Delete' })); // modal delete

    expect(handleDeleteSubpopulationElement).toBeCalledWith(subpopulation.uniqueId);
  });

  it('renders an element select inside the subpopulation', () => {
    const { getAllByText } = renderComponent();

    expect(getAllByText(/new element:/i)).toHaveLength(1);
  });

  it('renders a conjunction group with nested elements inside the subpopulation', () => {
    const element1 = {
      uniqueId: 'el-1',
      id: 'GenericProcedure_vsac',
      name: 'Procedure',
      type: 'element',
      returnType: 'list_of_procedures',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Element1' },
        { id: 'comment', type: 'textarea', name: 'Comment' },
        {
          id: 'procedure',
          type: 'procedure_vsac',
          name: 'Procedure',
          static: true,
          valueSets: []
        }
      ],
      modifiers: []
    };
    const element2 = {
      id: 'And',
      name: 'And',
      conjunction: true,
      returnType: 'boolean',
      uniqueId: 'And-1',
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name', value: 'Group1' },
        { id: 'comment', type: 'string', name: 'Comment', value: 'Includes a comment' }
      ],
      childInstances: [
        {
          ...element1,
          uniqueId: 'el-2',
          fields: [
            { id: 'element_name', type: 'string', name: 'Element Name', value: 'Element2' },
            { id: 'comment', type: 'textarea', name: 'Comment' },
            {
              id: 'procedure',
              type: 'procedure_vsac',
              name: 'Procedure',
              static: true,
              valueSets: []
            }
          ]
        }
      ]
    };

    const subpopulationWithChildren = {
      ...subpopulation,
      childInstances: [element1, element2]
    };
    const { getAllByText, getAllByRole } = renderComponent({
      subpopulation: subpopulationWithChildren
    });
    expect(getAllByText('Procedure:')).toHaveLength(2); // One top level procedure, one in the group
    expect(getAllByText('Group:')).toHaveLength(1); // One group
    expect(getAllByRole('button', { name: 'And' })).toHaveLength(3); // Two "And" dropdowns on top level subpopulation groups and one from Group
  });

  it('displays an alert if no elements are inside the subpopulation', () => {
    const alerts = getSubpopulationErrors(subpopulation, [], []);
    const { getByText } = renderComponent({ alerts });
    expect(getByText('Warning: This subpopulation needs at least one element.')).toBeInTheDocument();
  });

  it('displays an alert if a duplicate name is on the subpopulation', () => {
    const alerts = getSubpopulationErrors(
      subpopulation,
      [],
      [
        { name: 'First Subpopulation', id: 'foo123' }, // The subpopulation
        { name: 'First Subpopulation', id: 'not-foo123' } // Another element with the same name
      ]
    );
    const { getByText } = renderComponent({ alerts });
    expect(getByText(/Warning: Name already in use/i)).toBeInTheDocument();
  });

  it('displays an alert if a subpopulation is used in a recommendation', () => {
    const alerts = getSubpopulationErrors(
      subpopulation,
      [{ text: 'Talk to dr.', subpopulations: [{ subpopulationName: 'First Subpopulation', uniqueId: 'foo123' }] }],
      []
    );
    const { getByText } = renderComponent({ alerts });
    expect(
      getByText(/Subpopulation name can't be changed while it is being used in a recommendation/i)
    ).toBeInTheDocument();
  });

  it('displays an alert if any element in the subpopulation has an error when the subpopulation is collapsed', () => {
    const nonBooleanElement = {
      uniqueId: 'el-1',
      id: 'GenericProcedure_vsac',
      name: 'Procedure',
      type: 'element',
      returnType: 'list_of_procedures',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Element1' },
        { id: 'comment', type: 'textarea', name: 'Comment' },
        {
          id: 'procedure',
          type: 'procedure_vsac',
          name: 'Procedure',
          static: true,
          valueSets: []
        }
      ],
      modifiers: []
    };
    const subpopulationWithNonBooleanElement = {
      ...subpopulation,
      childInstances: [nonBooleanElement]
    };

    // Note: these calculations are done in Subpopulations and passed in
    const alerts = getSubpopulationErrors(subpopulationWithNonBooleanElement, [], []);
    const hasNestedWarning = hasGroupNestedWarning([nonBooleanElement], [], [], [], [], true);
    const hasErrors = alerts.filter(a => a.showAlert && a.alertSeverity === 'error').length > 0 || hasNestedWarning;

    const { getByText } = renderComponent({ alerts, hasErrors, subpopulation: subpopulationWithNonBooleanElement });

    // No alerts to display on the subpopulation itself
    expect(alerts.filter(a => a.showAlert)).toHaveLength(0);

    // Collapse the Subpopulation
    userEvent.click(screen.queryAllByRole('button', { name: /collapse/i })[0]);

    expect(getByText('Has errors.')).toBeInTheDocument();
  });
});
