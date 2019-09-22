import React from 'react';
import CodeSelectModal from '../CodeSelectModal';
import { render, fireEvent } from '../../../utils/test-utils';

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

  const getCodeSelectModal = () => document.querySelector('.code-select-modal');

  it('renders the component with proper elements', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.element-modal')).not.toBeNull();
    expect(container.querySelector('.primary-button')).toHaveTextContent('Add Code');
  });

  it('renders the proper children', () => {
    const { container } = renderComponent();

    fireEvent.click(container.querySelector('.primary-button'));

    const modal = getCodeSelectModal();
    expect(modal.querySelectorAll('.element-modal__container')).toHaveLength(1);
    expect(modal.querySelectorAll('.element-modal__search')).toHaveLength(1);
    expect(modal.querySelectorAll('#code-input')).toHaveLength(1);
    expect(modal.querySelectorAll('.element-modal__search-system')).toHaveLength(1);
  });

  it('can open modal with "Add Code" button', () => {
    const { getByText } = renderComponent();

    fireEvent.click(getByText('Add Code'));
    expect(getCodeSelectModal()).not.toBeEmpty();
  });

  describe('with modal open', () => {
    const setInputValue = (input, value) => {
      fireEvent.change(input, { target: { value } });
    };

    const renderAndOpenModal = props => {
      const renderedComponent = renderComponent(props);
      fireEvent.click(renderedComponent.getByText('Add Code'));

      return renderedComponent;
    };

    it('can close modal with "Close" button', () => {
      renderAndOpenModal();

      fireEvent.click(getCodeSelectModal().querySelector('.element__deletebutton'));
      expect(getCodeSelectModal()).toBeNull();
    });

    it('can input a code and code system and apply to an element', () => {
      const onElementSelected = jest.fn();
      const code = '123-4';

      const { getByText } = renderAndOpenModal({ onElementSelected });

      const selectButton = getByText('Select');
      const codeInput = document.querySelector('.element-modal__search-code');
      const codeSystemSelect = document.querySelector('.element-modal__search-system');

      // Enter code
      setInputValue(codeInput, code);

      // Choose first code system from dropdown
      fireEvent.keyDown(codeSystemSelect, { keyCode: 40 });
      fireEvent.click(document.querySelector('.search-system-select__option'));

      // Select button should be enabled
      expect(selectButton).not.toHaveAttribute('disabled');
      fireEvent.click(selectButton);

      // Selecting options calls onElementSelected to add to workspace and closes the modal
      expect(onElementSelected).toBeCalled();
      expect(getCodeSelectModal()).toBeNull();
    });

    it('choosing "Other" code system adds second input box to enter URI', () => {
      const otherCS = 'www.example.org';
      const addToParameter = jest.fn();

      const { getByText } = renderAndOpenModal({ addToParameter });
      const selectButton = getByText('Select');
      const codeInput = document.querySelector('.element-modal__search-code');
      const codeSystemSelect = document.querySelector('.element-modal__search-system');

      // Enter code
      setInputValue(codeInput, '123-4');

      // Choosing 'Other' option opens second input box
      fireEvent.keyDown(codeSystemSelect, { keyCode: 40 });
      const allOptions = document.querySelectorAll('.search-system-select__option');
      const lastOption = allOptions[allOptions.length - 1];
      fireEvent.click(lastOption);

      const codeSystemInput = document.getElementById('other-code-system');
      setInputValue(codeSystemInput, otherCS);

      // Select button should be enabled
      expect(selectButton).not.toHaveAttribute('disabled');
      fireEvent.click(selectButton);

      expect(addToParameter).toBeCalledWith({
        system: 'Other',
        uri: 'www.example.org',
        code: '123-4',
        display: ''
      });
    });

    it('resets code and code system when closing modal', () => {
      const { getByText } = renderAndOpenModal();

      const codeInput = () => document.querySelector('.element-modal__search-code');
      const codeSystemSelect = document.querySelector('.element-modal__search-system');

      // Enter code
      setInputValue(codeInput(), '123-4');

      // Choose first code system from dropdown
      fireEvent.keyDown(codeSystemSelect, { keyCode: 40 });
      fireEvent.click(document.querySelector('.search-system-select__option'));

      // Close modal
      fireEvent.click(getCodeSelectModal().querySelector('.element__deletebutton'));

      // Open modal
      fireEvent.click(getByText('Add Code'));

      // Inputs should be reset
      expect(codeInput()).toHaveAttribute('value', '');
      expect(document.querySelector('.search-system-select__placeholder')).toHaveTextContent('Select code system');
    });

    it('Modal for modifier calls correct function to update a modifier', () => {
      const updateModifier = jest.fn();
      const code = '123-4';

      const { getByText } = renderAndOpenModal({ updateModifier });

      const codeInput = document.querySelector('.element-modal__search-code');
      const codeSystemSelect = document.querySelector('.element-modal__search-system');

      // Enter code
      setInputValue(codeInput, code);

      // Choose SNOMED from dropdown
      fireEvent.keyDown(codeSystemSelect, { keyCode: 40 });
      fireEvent.click(getByText('SNOMED'));

      // Select button should be enabled
      fireEvent.click(getByText('Select'));

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
