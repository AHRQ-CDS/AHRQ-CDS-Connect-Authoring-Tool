import React from 'react';
import nock from 'nock';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, userEvent, within } from 'utils/test-utils';
import VSACOptionsAction from '../VSACOptionsAction';

describe('<VSACOptionsAction />', () => {
  const apiKey = 'api-123';
  const renderComponent = ({
    allowsVSAC = false,
    elementInstance = {},
    handleUpdateElement = jest.fn(),
    ...props
  } = {}) =>
    render(
      <VSACOptionsAction
        allowsVSAC={allowsVSAC}
        elementInstance={elementInstance}
        handleUpdateElement={handleUpdateElement}
        {...props}
      />
    );
  const renderComponentWithState = ({
    allowsVSAC = false,
    elementInstance = {},
    handleUpdateElement = jest.fn(),
    ...props
  } = {}) =>
    render(
      <Provider store={createStore(x => x, { vsac: { apiKey } })}>
        <VSACOptionsAction
          allowsVSAC={allowsVSAC}
          elementInstance={elementInstance}
          handleUpdateElement={handleUpdateElement}
          {...props}
        />
      </Provider>
    );

  afterAll(() => nock.restore());

  it('renders nothing if vsac is not allowed', () => {
    renderComponent({ allowsVSAC: false });

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('should render authenticated text when api key provided', () => {
    renderComponent({ allowsVSAC: true });
    let button = screen.getByRole('button', { name: 'Authenticate VSAC' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled(); // button not disabled in order to authenticate

    renderComponent({ allowsVSAC: true, vsacApiKey: apiKey });
    button = screen.getByRole('button', { name: 'VSAC Authenticated' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); // button disabled when already authenticated
  });

  it('should open VSAC Auth modal to authenticate', () => {
    renderComponent({ allowsVSAC: true });
    const button = screen.getByRole('button', { name: 'Authenticate VSAC' });
    userEvent.click(button);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  describe('modals', () => {
    beforeEach(() => {
      nock('http://localhost')
        .persist()
        .get('/authoring/api/fhir/search?keyword=TestCondition')
        .basicAuth({ user: '', pass: apiKey })
        .reply(200, {
          count: 1,
          results: [
            {
              name: 'Test VS',
              type: 'Grouping',
              steward: 'Test Steward',
              oid: '1.2.3',
              codeCount: 4,
              codeSystem: ['Test CS']
            }
          ]
        });
    });
    it('should open VS select modal and update element when adding a value set', async () => {
      const handleUpdateElement = jest.fn();
      renderComponentWithState({
        handleUpdateElement,
        allowsVSAC: true,
        vsacApiKey: apiKey,
        elementInstance: {
          fields: [
            { id: 'element_name', value: 'Test Element' },
            { id: 'condition', type: 'condition_vsac' }
          ]
        }
      });

      const addVSButton = screen.getByRole('button', { name: 'Add Value Set' });
      userEvent.click(addVSButton);
      const dialog = within(screen.getByRole('dialog'));
      expect(dialog.getByText('Choose value set')).toBeInTheDocument();
      fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
      userEvent.click(dialog.getByRole('button', { name: 'Search' }));
      expect(await dialog.findByText('Name/OID')).toBeInTheDocument();
      userEvent.click(dialog.getByText('Test VS'));

      expect(handleUpdateElement).toHaveBeenCalledTimes(1);
    });

    it('should update element when adding a code', async () => {
      const handleUpdateElement = jest.fn();
      renderComponentWithState({
        handleUpdateElement,
        allowsVSAC: true,
        vsacApiKey: apiKey,
        elementInstance: {
          fields: [
            { id: 'element_name', value: 'Test Element' },
            { id: 'condition', type: 'condition_vsac' }
          ]
        }
      });

      const addCodeButton = screen.getByRole('button', { name: 'Add Code' });
      userEvent.click(addCodeButton);
      const dialog = within(screen.getByRole('dialog'));
      expect(dialog.getByText('Choose code')).toBeInTheDocument();
      fireEvent.change(dialog.getByLabelText('Code'), { target: { value: '123-4' } });
      userEvent.click(dialog.getByLabelText('Code system'));
      userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));
      userEvent.click(dialog.getByRole('button', { name: 'Select' }));
      expect(handleUpdateElement).toHaveBeenCalledTimes(1);
    });
  });
});
