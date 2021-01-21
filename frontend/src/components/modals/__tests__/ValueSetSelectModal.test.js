import React from 'react';
import nock from 'nock';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, userEvent, within } from 'utils/test-utils';
import ValueSetSelectModal from '../ValueSetSelectModal';

describe('<ValueSetSelectModal />', () => {
  const apiKey = 'api-123';
  const testVsacSearchResults = [
    { name: 'Test VS', type: 'Grouping', steward: 'Test Steward', oid: '1.2.3', codeCount: 4, codeSystem: ['Test CS'] },
    { name: 'New VS', type: 'Extentional', steward: 'New Steward', oid: '3.4.5', codeCount: 8, codeSystem: ['New CS'] }
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

  it('can close the modal with the "Cancel" button', async () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal });

    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('can search for and select a value set', async () => {
    const handleSelectValueSet = jest.fn();
    const handleCloseModal = jest.fn();
    renderComponent({ handleSelectValueSet, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('Choose value set')).toBeInTheDocument();

    fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
    userEvent.click(dialog.getByRole('button', { name: 'Search' }));

    expect(await dialog.findByText('Name/OID')).toBeInTheDocument();
    expect(dialog.getByText('Test VS')).toBeInTheDocument();
    expect(dialog.getByText('New VS')).toBeInTheDocument();

    userEvent.click(dialog.getByText('New VS'));

    expect(await dialog.findByText('Code System')).toBeInTheDocument();
    expect(dialog.getByRole('textbox')).toHaveValue('New VS (3.4.5)');
    expect(dialog.getByText('123-4')).toBeInTheDocument();
    expect(dialog.getByText('Code Display Name')).toBeInTheDocument();
    expect(dialog.getByText('CodeSysName')).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', { name: 'Select' }));

    expect(handleSelectValueSet).toHaveBeenCalledWith({ name: 'New VS', oid: '3.4.5' });
    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('returns to the search page back when the back button is clicked', async () => {
    renderComponent();

    const dialog = within(screen.getByRole('dialog'));

    fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
    userEvent.click(dialog.getByRole('button', { name: 'Search' }));

    userEvent.click(await dialog.findByText('New VS'));

    expect(await dialog.findByText('Code System')).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', { name: 'Back' }));

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

    userEvent.click(dialog.getByRole('button', { name: 'Close' }));

    expect(handleCloseModal).toHaveBeenCalled();
  });
});
