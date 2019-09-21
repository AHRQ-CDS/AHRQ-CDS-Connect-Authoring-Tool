import React from 'react';
import { prettyDOM } from '@testing-library/react';
import ElementSelect from '../../../components/builder/ElementSelect';
import { fullRenderComponent } from '../../../utils/test_helpers';
import { render, fireEvent } from '../../../utils/test-utils';
import { genericElementTypes, genericElementGroups } from '../../../utils/test_fixtures';

describe('<ElementSelect />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ElementSelect
        baseElements={[]}
        categories={genericElementGroups}
        externalCqlList={[]}
        getVSDetails={jest.fn()}
        inBaseElements={false}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        loadExternalCqlList={jest.fn()}
        loginVSACUser={jest.fn()}
        onSuggestionSelected={jest.fn()}
        parameters={[]}
        resetCodeValidation={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        validateCode={jest.fn()}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError={''}
        vsacFHIRCredentials={{ username: 'name', password: 'pass' }}
        vsacSearchCount={0}
        vsacSearchResults={[]}
        vsacStatus={''}
        vsacStatusText={''}
        {...props}
      />
    );

  it('renders the component with proper elements', () => {
    const { container } = renderComponent();

    expect(container.firstChild).toHaveClass('element-select');
    expect(container.firstChild.firstChild).toHaveClass('element-select__add-element');

    expect(container.querySelectorAll('.element-select__element-field')).toHaveLength(1);
    expect(container.querySelectorAll('.is-open')).toHaveLength(0);
  });

  describe('select element field', () => {
    it('starts with correct placeholder text', () => {
      const { queryByText, queryByLabelText } = renderComponent();

      expect(queryByText('Choose element type')).not.toBeNull();
      expect(queryByLabelText('Choose element type')).not.toBeNull();
    });

    it('starts with a list of all elements', () => {
      const { container, getByLabelText } = renderComponent();

      fireEvent.keyDown(getByLabelText('Choose element type'), { keyCode: 40 });

      expect(container.querySelectorAll('.element-select__option')).toHaveLength(11);
    });

    it('options display correct values and have key icon if VSAC auth required', () => {
      const { container, getByLabelText } = renderComponent();

      fireEvent.keyDown(getByLabelText('Choose element type'), { keyCode: 40 });

      container.querySelectorAll('.element-select__option').forEach((option, i) => {
        const { label, vsacAuthRequired } = genericElementTypes[i];

        expect(option).toHaveTextContent(label);
        expect(Boolean(option.querySelector('.element-select__option-category'))).toBe(vsacAuthRequired);
      });
    });

    it('selects a generic type without VSAC authentication and adds it to the workspace', () => {
      const onSuggestionSelected = jest.fn();
      const { getByLabelText, getByText, queryByText } = renderComponent({ onSuggestionSelected });

      fireEvent.keyDown(getByLabelText('Choose element type'), { keyCode: 40 });
      fireEvent.click(getByText('Demographics'));

      // Choosing no VSAC auth element renders second select box.
      expect(queryByText('Select Demographics element')).not.toBeNull();

      // Choosing first option adds it to workspace
      fireEvent.keyDown(getByLabelText('Select Demographics element'), { keyCode: 40 });
      fireEvent.click(getByText('Age Range'));

      expect(onSuggestionSelected).toBeCalledWith(genericElementGroups[0].entries[0]);
    });

    it('displays the Authenticate VSAC button when not logged in and selecting a generic type with VSAC auth', () => {
      const { getByText, getByLabelText } = renderComponent({ vsacFHIRCredentials: { username: null } });

      fireEvent.keyDown(getByLabelText('Choose element type'), { keyCode: 40 });
      fireEvent.click(getByText('Observation'));

      expect(getByText('Authenticate VSAC')).not.toBeNull();
    });

    it(
      'displays the Add Value Set and Add Code buttons when logged in and selecting a generic type with VSAC auth',
      () => {
        const { getByText, getByLabelText } = renderComponent();

        fireEvent.keyDown(getByLabelText('Choose element type'), { keyCode: 40 });
        fireEvent.click(getByText('Observation'));

        expect(getByText('VSAC Authenticated')).not.toBeNull();
        expect(getByText('Add Value Set')).not.toBeNull();
        expect(getByText('Add Code')).not.toBeNull();
      });
  });

  describe('in base elements', () => {
    it('does not allow an option to be selected', () => {
      const { container, getByText, getByLabelText } = renderComponent({ disableElement: true });

      fireEvent.keyDown(getByLabelText('Choose element type'), { keyCode: 40 });

      expect(container.querySelectorAll('.element-select__option')).toHaveLength(0);
      expect(getByText('Cannot add element when Base Element List in use')).not.toBeNull();
    });
  });
});
