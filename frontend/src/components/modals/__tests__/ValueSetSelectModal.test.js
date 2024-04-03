import React from 'react';
import nock from 'nock';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, userEvent, within, waitFor } from 'utils/test-utils';
import ValueSetSelectModal from '../ValueSetSelectModal';

describe('<ValueSetSelectModal />', () => {
  const apiKey = 'api-123';
  const testVsacSearchResults = [
    // NOTE: This is the order value sets are displayed because results are sorted by VSAC API
    {
      name: 'Test VS',
      steward: 'Test Steward',
      oid: '1.2.3',
      codeCount: 4,
      codeSystem: ['Test CS'],
      date: '2020-01-01',
      lastReviewDate: '2023-10-21',
      description: 'A test value set',
      experimental: true,
      status: 'active',
      purpose: {
        clinicalFocus: 'Example clinical focus',
        dataElementScope: 'Example data element scope',
        inclusionCriteria: 'Example inclusion criteria',
        exclusionCriteria: 'Example exclusion criteria'
      }
    },
    {
      name: 'Other VS',
      steward: 'Other Steward',
      oid: '3.2.1',
      codeCount: 2,
      codeSystem: ['Other CS'],
      status: 'draft',
      purpose: { purpose: 'A generic purpose in any format string' }
    },
    {
      name: 'Retired VS',
      steward: 'Retired Steward',
      oid: '7.8.9',
      codeCount: 2,
      codeSystem: ['Retired CS'],
      status: 'retired'
    },
    { name: 'New VS', steward: 'New Steward', oid: '3.4.5', codeCount: 8, codeSystem: ['New CS'], status: '' }
  ];
  const testVsacDetails = [
    {
      code: '123-4',
      codeSystem: '1.2.3',
      codeSystemName: 'CodeSysName',
      codeSystemVersion: '1.2',
      displayName: 'Code Display Name'
    }
  ];

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore(x => x, { vsac: { apiKey } })}>
        <ValueSetSelectModal
          handleCloseModal={jest.fn()}
          handleSelectValueSet={jest.fn()}
          savedValueSet={null}
          readOnly={false}
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get('/authoring/api/fhir/search?keyword=TestCondition')
      .basicAuth({ user: '', pass: apiKey })
      .reply(200, {
        count: 2,
        results: testVsacSearchResults
      })
      .get('/authoring/api/fhir/vs/3.4.5')
      .basicAuth({ user: '', pass: apiKey })
      .reply(200, {
        codes: testVsacDetails
      })
      .get('/authoring/api/fhir/vs/1.2.3')
      .basicAuth({ user: '', pass: apiKey })
      .reply(404);
  });

  afterAll(() => nock.restore());

  it('can close the modal with the "Cancel" button', async () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal });

    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Cancel' })));

    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('can search for and select a value set', async () => {
    const handleSelectValueSet = jest.fn();
    const handleCloseModal = jest.fn();
    renderComponent({ handleSelectValueSet, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('Choose value set')).toBeInTheDocument();

    fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Search' })));

    expect(await dialog.findByText('Value Set')).toBeInTheDocument();
    expect(dialog.getByText('Test VS')).toBeInTheDocument();
    expect(dialog.getByText('New VS')).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByText('New VS')));

    expect(handleSelectValueSet).toHaveBeenCalledWith({ name: 'New VS', oid: '3.4.5' });
    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('can search for and render all value set info available', async () => {
    const handleSelectValueSet = jest.fn();
    const handleCloseModal = jest.fn();
    renderComponent({ handleSelectValueSet, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('Choose value set')).toBeInTheDocument();

    fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Search' })));

    expect(await dialog.findByText('Value Set')).toBeInTheDocument();
    expect(dialog.getByText('Test VS')).toBeInTheDocument();
    expect(dialog.getByText('New VS')).toBeInTheDocument();

    expect(dialog.getByText('Oct 21, 2023').parentElement.textContent).toEqual('Reviewed:Oct 21, 2023');
    expect(dialog.getByText('Jan 1, 2020').parentElement.textContent).toEqual('Updated:Jan 1, 2020');
    expect(dialog.getByLabelText('Experimental')).toBeInTheDocument();

    // the three vs without dates or experimental doesn't render blanks
    expect(dialog.getAllByText(/Reviewed:/)).toHaveLength(1);
    expect(dialog.getAllByText(/Updated:/)).toHaveLength(1);
    expect(dialog.getAllByLabelText('Experimental')).toHaveLength(1);

    // One VS has status retired, one has status draft. Active and blank statuses don't render anything.
    expect(dialog.getAllByLabelText('Retired')).toHaveLength(1);
    expect(dialog.getAllByLabelText('Draft')).toHaveLength(1);

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Expand details for Test VS' })));
    expect(dialog.getByText('Description:').parentElement.textContent).toEqual('Description: A test value set');
    expect(dialog.getByText('Clinical Focus:').parentElement.textContent).toEqual(
      'Clinical Focus: Example clinical focus'
    );
    expect(dialog.getByText('Data Element Scope:').parentElement.textContent).toEqual(
      'Data Element Scope: Example data element scope'
    );
    expect(dialog.getByText('Inclusion Criteria:').parentElement.textContent).toEqual(
      'Inclusion Criteria: Example inclusion criteria'
    );
    expect(dialog.getByText('Exclusion Criteria:').parentElement.textContent).toEqual(
      'Exclusion Criteria: Example exclusion criteria'
    );

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Expand details for Other VS' })));
    expect(dialog.getByText('Purpose:').parentElement.textContent).toEqual(
      'Purpose: A generic purpose in any format string'
    );

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Expand details for New VS' })));
    expect(dialog.getByText('No additional information provided')).toBeInTheDocument();
  });

  it('can search for and select a value set after viewing codes', async () => {
    const handleSelectValueSet = jest.fn();
    const handleCloseModal = jest.fn();
    renderComponent({ handleSelectValueSet, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('Choose value set')).toBeInTheDocument();

    fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Search' })));

    expect(await dialog.findByText('Value Set')).toBeInTheDocument();
    expect(dialog.getByText('Test VS')).toBeInTheDocument();
    expect(dialog.getByText('New VS')).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'View Value Set New VS' })));

    expect(await dialog.findByText('Code System')).toBeInTheDocument();
    expect(dialog.getByRole('textbox')).toHaveValue('New VS (3.4.5)');
    expect(dialog.getByText('123-4')).toBeInTheDocument();
    expect(dialog.getByText('Code Display Name')).toBeInTheDocument();
    expect(dialog.getByText('CodeSysName')).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Select' })));

    expect(handleSelectValueSet).toHaveBeenCalledWith({ name: 'New VS', oid: '3.4.5' });
    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('returns to the search page back when the back button is clicked', async () => {
    renderComponent();

    const dialog = within(screen.getByRole('dialog'));

    fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Search' })));

    expect(await dialog.findByText('Value Set')).toBeInTheDocument();
    expect(dialog.getByText('Test VS')).toBeInTheDocument();
    expect(dialog.getByText('New VS')).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'View Value Set New VS' })));

    expect(await dialog.findByText('Code System')).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Back' })));

    expect(await dialog.findByText('New VS')).toBeInTheDocument();
    expect(dialog.getByText('Test VS')).toBeInTheDocument();
  });

  it('opens to the details view when a value set is provided', async () => {
    renderComponent({ savedValueSet: { name: 'New VS', oid: '3.4.5' } });

    const dialog = within(screen.getByRole('dialog'));

    expect(await dialog.findByText('Code System')).toBeInTheDocument();
    expect(dialog.getByRole('textbox')).toHaveValue('New VS (3.4.5)');
    expect(dialog.getByText('123-4')).toBeInTheDocument();
    expect(dialog.getByText('Code Display Name')).toBeInTheDocument();
    expect(dialog.getByText('CodeSysName')).toBeInTheDocument();
    expect(dialog.getByRole('textbox')).toHaveValue('New VS (3.4.5)');
  });

  it('renders an error message if the details cannot be found', async () => {
    renderComponent({ savedValueSet: { name: 'Test VS', oid: '1.2.3' } });

    const dialog = within(screen.getByRole('dialog'));

    expect(await dialog.findByText(/Unable to retrieve codes for this value set/)).toBeInTheDocument();
  });

  it('can render in a read-only mode', async () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal, savedValueSet: { name: 'New VS', oid: '3.4.5' }, readOnly: true });

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('View value set')).toBeInTheDocument();

    expect(await dialog.findByText('Code System')).toBeInTheDocument();
    expect(dialog.getByRole('textbox')).toHaveValue('New VS (3.4.5)');
    expect(dialog.getByText('123-4')).toBeInTheDocument();

    expect(dialog.getByRole('textbox')).toHaveAttribute('readonly');
    expect(dialog.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(dialog.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Close' })));

    expect(handleCloseModal).toHaveBeenCalled();
  });
});
