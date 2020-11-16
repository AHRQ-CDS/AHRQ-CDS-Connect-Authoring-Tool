import React from 'react';
import { render, fireEvent, userEvent, screen, waitFor, within } from 'utils/test-utils';
import CodeSelectModal from '../CodeSelectModal';

describe('<CodeSelectModal />', () => {
  const renderComponent = (props = {}) =>
    render(
      <CodeSelectModal
        onElementSelected={jest.fn()}
        resetCodeValidation={jest.fn()}
        template={{
          id: 'GenericObservation',
          name: 'Observation',
          returnType: 'list_of_observations',
          suppress: true,
          extends: 'Base',
          fields: [
            { id: 'element_name', type: 'string', name: 'Element Name' },
            { id: 'observation', type: 'observation_vsac', name: 'Observation' }
          ]
        }}
        {...props}
      />
    );

  it('renders the component with proper elements', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'Add Code' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can open modal with "Add Code" button', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Add Code' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the proper children', () => {
    renderComponent();

    userEvent.click(screen.getByRole('button', { name: 'Add Code' }));

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('Choose code')).toBeInTheDocument();
    expect(dialog.getByLabelText('Enter code')).toBeInTheDocument();
    expect(dialog.getByLabelText('Code system')).toBeInTheDocument();
    expect(dialog.getByLabelText('Validate')).toBeInTheDocument();
    expect(dialog.getByRole('button', {name: 'Select'})).toBeInTheDocument();
    expect(dialog.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });

  describe('with modal open', () => {
    const setInputValue = (input, value) => {
      fireEvent.change(input, { target: { value } });
    };

    const renderAndOpenModal = props => {
      const renderedComponent = renderComponent(props);
      fireEvent.click(screen.getByRole('button', { name: 'Add Code' }));

      return renderedComponent;
    };

    it('can close modal with "Close" button', async () => {
      renderAndOpenModal();

      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('can input a code and code system and apply to an element', async () => {
      const onElementSelected = jest.fn();
      const code = '123-4';

      renderAndOpenModal({ onElementSelected });

      // Enter code
      setInputValue(screen.getByLabelText('Enter code'), code);

      // Choose first code system from dropdown
      userEvent.click(screen.getByLabelText('Code system'));
      userEvent.click(screen.getAllByRole('option')[0]);

      userEvent.click(screen.getByRole('button', { name: 'Select' }));

      // Selecting options calls onElementSelected to add to workspace and closes the modal
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(onElementSelected).toBeCalled();
    });

    it('choosing "Other" code system adds second input box to enter URI', async () => {
      const otherCS = 'www.example.org';
      const addToParameter = jest.fn();

      renderAndOpenModal({ addToParameter });

      // Enter code
      setInputValue(screen.getByLabelText('Enter code'), '123-4');

      // Choosing 'Other' option opens second input box
      userEvent.click(screen.getByLabelText('Code system'));
      userEvent.click(screen.getByRole('option', { name: 'Other' }));

      setInputValue(screen.getByLabelText('Enter system canonical URL'), otherCS);

      userEvent.click(screen.getByRole('button', { name: 'Select' }));

      await waitFor(() => {
        expect(addToParameter).toBeCalledWith({
          system: 'Other',
          uri: 'www.example.org',
          code: '123-4',
          display: ''
        });
      });
    });

    it('resets code and code system when closing modal', async () => {
      renderAndOpenModal();

      // Enter code
      setInputValue(screen.getByLabelText('Enter code'), '123-4');

      // Choose first code system from dropdown
      userEvent.click(screen.getByLabelText('Code system'));
      userEvent.click(screen.getAllByRole('option')[0]);

      // Close modal
      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      // Open modal
      fireEvent.click(await screen.findByRole('button', { name: 'Add Code' }));

      // Inputs should be reset
      expect(screen.getByLabelText('Enter code')).toHaveAttribute('value', '');
      expect(screen.getByLabelText('Code system')).toHaveTextContent('\u200B');
    });

    it('Modal for modifier calls correct function to update a modifier', async () => {
      const updateModifier = jest.fn();
      const code = '123-4';

      renderAndOpenModal({ updateModifier });

      // Enter code
      setInputValue(screen.getByLabelText('Enter code'), code);

      // Choose SNOMED from dropdown
      userEvent.click(screen.getByLabelText('Code system'));
      userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));

      // Select button should be enabled
      userEvent.click(screen.getByRole('button', { name: 'Select' }));

      await waitFor(() => {
        expect(updateModifier).toBeCalledWith({
          code,
          codeSystem: {
            name: 'SNOMED',
            id: 'http://snomed.info/sct'
          },
          display: ''
        });
      });
    });
  });
});
