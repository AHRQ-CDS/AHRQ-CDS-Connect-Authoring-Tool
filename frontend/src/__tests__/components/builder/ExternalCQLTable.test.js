import React from 'react';
import ExternalCQLTable from '../../../components/builder/ExternalCqlTable';
import mockExternalLib from '../../../mocks/mockExternalCQLLibrary.json';
import mockExternalLibDependency from '../../../mocks/mockExternalCQLLibraryDependency.json';
import { render, fireEvent } from '../../../utils/test-utils';

describe('<ExternalCQLTable />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalCQLTable
        artifact={{}}
        clearAddLibraryErrorsAndMessages={jest.fn()}
        deleteExternalCqlLibrary={jest.fn()}
        externalCqlLibraryDetails={null}
        externalCQLLibraryParents={{}}
        externalCqlList={[mockExternalLib, mockExternalLibDependency]}
        isLoadingExternalCqlDetails={false}
        librariesInUse={[]}
        loadExternalCqlLibraryDetails={jest.fn()}
        loadExternalCqlList={jest.fn()}
        {...props}
      />
    );

  it('renders external libraries', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('shows a confirmation modal on delete and deletes on confirm', () => {
    const deleteExternalCqlLibrary = jest.fn();
    const { getByText, getAllByText } = renderComponent({ deleteExternalCqlLibrary });

    fireEvent.click(getAllByText('Delete')[0]);

    expect(getByText('Delete External CQL Library Confirmation')).not.toBeNull();

    const deleteButtons = getAllByText('Delete');
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    expect(deleteExternalCqlLibrary).toHaveBeenCalled();
  });

  it('shows the details modal when View is clicked', () => {
    const { getByText, getAllByLabelText } = renderComponent({ externalCqlLibraryDetails: mockExternalLib });

    fireEvent.click(getAllByLabelText('View')[0]);

    expect(getByText('View External CQL Details')).not.toBeNull();
  });

  it('doesn\'t allow delete on libraries that are depended on by others', () => {
    const deleteExternalCqlLibrary = jest.fn();
    const { container, getAllByText } = renderComponent({
      deleteExternalCqlLibrary,
      externalCqlLibraryDetails: mockExternalLib,
      externalCQLLibraryParents: {
        'cql-upload-1.0.0': [],
        'cds-connect-conversions-new-2': ['cql-upload-1.0.0']
      }
    });

    // Two libraries, one depends on the other. Dependency delete is disabled.
    let deleteButtons = container.querySelectorAll('button.danger-button');
    let disabledButton = container.querySelectorAll('button.danger-button.disabled');
    expect(deleteButtons).toHaveLength(2);
    expect(disabledButton).toHaveLength(1);

    // Delete a library that has no parents
    fireEvent.click(container.querySelector('button.danger-button:not(.disabled)'));

    deleteButtons = getAllByText('Delete');
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    expect(deleteExternalCqlLibrary).toHaveBeenCalled();
  });
});
