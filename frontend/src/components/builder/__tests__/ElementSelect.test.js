import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import { genericElementTypes, genericElementGroups } from 'utils/test_fixtures';
import ElementSelect from '../ElementSelect';

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
        vsacApiKey={'key'}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError={''}
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

    expect(screen.getByLabelText('Element type')).toBeInTheDocument();
    expect(screen.queryAllByRole('option').length).toEqual(0);
  });

  describe('select element field', () => {
    it('starts with correct placeholder text', () => {
      renderComponent();

      expect(screen.getByLabelText('Element type')).toBeInTheDocument();
    });

    it('starts with a list of all elements', () => {
      renderComponent();

      userEvent.click(screen.getByLabelText('Element type'));
      expect(screen.queryAllByRole('option').length).toEqual(15);
    });

    it('options display correct values and have key icon if VSAC auth required', () => {
      renderComponent();

      expect(screen.getByLabelText('Element type')).toBeInTheDocument();

      screen.queryAllByRole('option').forEach((option, index) => {
        const { label, vsacAuthRequired } = genericElementTypes[index];
        expect(option).toHaveTextContent(label);
        expect(Boolean(option.queryAllByRole('option'))).toBe(vsacAuthRequired);
      });
    });

    it('selects a generic type without VSAC authentication and adds it to the workspace', () => {
      const onSuggestionSelected = jest.fn();
      const { getByText } = renderComponent({ onSuggestionSelected });

      expect(screen.getByLabelText('Element type')).toBeInTheDocument();
      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(getByText('Demographics'));

      // Choosing no VSAC auth element renders second select box.
      expect(screen.getByLabelText('Demographics element')).toBeInTheDocument();

      // Choosing first option adds it to workspace
      userEvent.click(screen.getByLabelText('Demographics element'));
      userEvent.click(getByText('Age Range'));

      expect(onSuggestionSelected).toBeCalledWith(genericElementGroups[0].entries[0]);
    });

    it('displays the Authenticate VSAC button when not logged in and selecting a generic type with VSAC auth', () => {
      const { getByText } = renderComponent({ vsacApiKey:  null });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(getByText('Observation'));

      expect(getByText('Authenticate VSAC')).toBeInTheDocument();
    });

    it(
      'displays the Add Value Set and Add Code buttons when logged in and selecting a generic type with VSAC auth',
      () => {
        const { getByText } = renderComponent();

        userEvent.click(screen.getByLabelText('Element type'));
        userEvent.click(getByText('Observation'));

        expect(getByText('VSAC Authenticated')).toBeInTheDocument();
        expect(getByText('Add Value Set')).toBeInTheDocument();
        expect(getByText('Add Code')).toBeInTheDocument();
      });
  });

  describe('in base elements', () => {
    it('does not allow an option to be selected', () => {
      const { container, getByText } = renderComponent({ disableAddElement: true });

      userEvent.click(screen.getByLabelText('Element type'));

      expect(container.querySelectorAll('.element-select__option')).toHaveLength(0);
      expect(getByText('Cannot add element when Base Element List in use')).toBeInTheDocument();
    });
  });
});
