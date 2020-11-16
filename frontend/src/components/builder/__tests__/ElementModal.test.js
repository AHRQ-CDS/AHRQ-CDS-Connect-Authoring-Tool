import React from 'react';
import ElementModal from '../ElementModal';
import { getFieldWithId, getFieldWithType } from 'utils/instances';
import { render, screen, userEvent, waitFor } from 'utils/test-utils';

describe('<ElementModal />', () => {
  const testTemplate = {
    id: 'GenericObservation',
    name: 'Observation',
    returnType: 'list_of_observations',
    suppress: true,
    extends: 'Base',
    fields: [
      { id: 'element_name', type: 'string', name: 'Element Name' },
      { id: 'observation', type: 'observation_vsac', name: 'Observation' }
    ]
  };

  const testVsacDetails = [
    { code: '123-4', codeSystem: '1.2.3', codeSystemName: 'CodeSysName', codeSystemVersion: '1.2', displayName: 'Name' }
  ];

  const testVsacSearchResults = [
    { name: 'Test VS', type: 'Grouping', steward: 'Test Steward', oid: '1.2.3', codeCount: 4, codeSystem: ['Test CS'] },
    { name: 'New VS', type: 'Extentional', steward: 'New Steward', oid: '3.4.5', codeCount: 8, codeSystem: ['New CS'] }
  ];

  const renderComponent = (props = {}) =>
    render(
      <ElementModal
        getVSDetails={jest.fn()}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        onElementSelected={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        template={testTemplate}
        useIconButton={false}
        vsacApiKey={'key'}
        vsacDetailsCodes={testVsacDetails}
        vsacSearchCount={0}
        vsacSearchResults={testVsacSearchResults}
        {...props}
      />
    );

  it('renders the component with proper elements', () => {
    const { container, queryByText } = renderComponent();

    expect(container.firstChild).toHaveClass('element-modal');
    expect(queryByText('Add Value Set')).toBeInTheDocument();
  });

  it('can set open and close the modal', async () => {
    const { getByText } = renderComponent();

    expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
    userEvent.click(getByText('Add Value Set'));
    expect(document.querySelector('.MuiDialog-root')).toBeInTheDocument();
    
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
    });
  });

  it('can open a modal using an icon instead of a button', () => {
    renderComponent({ useIconButton: true });

    userEvent.click(screen.getByRole('button'));
    expect(document.querySelector('.MuiDialog-root')).toBeInTheDocument();
  });

  describe('with modal open', () => {
    const renderAndOpenModal = props => {
      const component = renderComponent(props);
      userEvent.click(component.getByText('Add Value Set'));

      return component;
    };

    const getSearchInput = () => document.querySelector('.element-modal__search input');

    it('can close modal with "Cancel" button', async () => {
      renderAndOpenModal();

      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
      });
    });

    it('can select a valueset', () => {
      const [ vsacSearchResult ] = testVsacSearchResults;

      const getVSDetails = jest.fn();
      const onElementSelected = jest.fn();

      renderAndOpenModal({ getVSDetails, onElementSelected });

      // Clicking the select button before choosing a value set does nothing
      const selectButton = screen.getByRole('button', { name: 'Select' });
      userEvent.click(selectButton);
      expect(onElementSelected).not.toBeCalled();

      // Click on a VS returned by the search
      userEvent.click(document.querySelector(`.search__table tbody tr[aria-label="${vsacSearchResult.name}"]`));

      // Clicking an individual VS gets the details and displays them in the table and input field.
      expect(getVSDetails).toBeCalledWith(vsacSearchResult.oid, 'key');
      expect(document.querySelectorAll('.search__table')).toHaveLength(1);
      expect(document.querySelectorAll('.search__table thead th')).toHaveLength(3);

      const [code] = testVsacDetails;
      const codeToString = code.code + code.displayName + code.codeSystemName;

      expect(document.querySelector('.search__table tbody tr')).toHaveTextContent(codeToString);
      expect(getSearchInput()).toHaveValue(
        `${vsacSearchResult.name} (${vsacSearchResult.oid})`
      );

      // Clicking the select button class the onElementSelected function
      userEvent.click(selectButton);

      const nameField = {
        ...getFieldWithId(testTemplate.fields, 'element_name'),
        value: vsacSearchResult.name
      };

      const vsacField = {
        ...getFieldWithType(testTemplate.fields, '_vsac'),
        static: true,
        valueSets: [{ name: vsacSearchResult.name, oid: vsacSearchResult.oid }]
      };

      expect(onElementSelected).toBeCalledWith({
        ...testTemplate,
        fields: [
          nameField,
          vsacField
        ]
      });
    });

    it('calls vsac search action when searching', () => {
      const searchVSACByKeyword = jest.fn();
      renderAndOpenModal({ searchVSACByKeyword });

      userEvent.type(getSearchInput(), 'cholest');
      userEvent.type(getSearchInput(), '{enter}');

      expect(searchVSACByKeyword).toBeCalledWith('cholest', 'key');
    });

    it('using the back arrow returns to search results table', () => {
      renderAndOpenModal();

      // Click on a VS returned by the search, changes to the details table.
      userEvent.click(document.querySelector('.search__table tbody tr'));

      expect(document.querySelector('.search__table thead')).toHaveTextContent('CodeNameCode System'); // Details table headings

      // Clicking the arrow button changes to search table and resets selectedElement.
      userEvent.click(document.querySelector('.nav-icon'));

      expect(document.querySelector('.search__table thead')).toHaveTextContent(
        'Name/OIDStewardCodes' // Search table headings
      );
      expect(document.querySelector('.search__table')).toHaveClass('selectable');
    });

    it('viewOnly flag does not allow for selecting value set or navigating back to search', () => {
      renderAndOpenModal({
        selectedElement: { name: 'Test VS', oid: '1.2.3' },
        viewOnly: true
      });

      expect(document.querySelectorAll('.nav-icon')).toHaveLength(0); // No back arrow.
      expect(document.querySelectorAll('.element-modal__searchbutton')).toHaveLength(0); // No search/select button.
    });

    it('resets search term when closing modal', () => {
      const searchVSACByKeyword = jest.fn();
      const { getByText } = renderAndOpenModal({ searchVSACByKeyword });

      // Set search input value
      userEvent.type(getSearchInput(), 'derp');

      // Close modal
      userEvent.click(getByText('Cancel'));

      expect(searchVSACByKeyword).toBeCalledWith('');
    });

    it('calls the correct update function ', async () => {
      const [vsacSearchResult] = testVsacSearchResults;
      const updateModifier = jest.fn();

      const { getByText } = renderAndOpenModal({ updateModifier });

      // Choose a value set
      userEvent.click(document.querySelector(`.search__table tbody tr[aria-label="${vsacSearchResult.name}"]`));

      // Clicking the select button calls the modifier update function with correct object and closes modal
      userEvent.click(getByText('Select'));

      expect(updateModifier).toBeCalledWith({
        name: vsacSearchResult.name,
        oid: vsacSearchResult.oid
      });

      await waitFor(() => {
        expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
      });
    });
  });
});
