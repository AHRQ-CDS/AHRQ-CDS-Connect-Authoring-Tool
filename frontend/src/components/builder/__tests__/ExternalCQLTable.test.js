import React from 'react';
import mockExternalLib from 'mocks/mockExternalCQLLibrary.json';
import mockExternalLibDependency from 'mocks/mockExternalCQLLibraryDependency.json';
import { render, screen, userEvent, within } from 'utils/test-utils';
import ExternalCqlTable from '../ExternalCqlTable';

describe('<ExternalCqlTable />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalCqlTable
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
    renderComponent();

    expect(document.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('shows a confirmation modal on delete and deletes on confirm', () => {
    const deleteExternalCqlLibrary = jest.fn();
    renderComponent({ deleteExternalCqlLibrary });

    userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('Delete External CQL Library Confirmation')).toBeInTheDocument();
    userEvent.click(dialog.getByRole('button', { name: 'Delete' }));

    expect(deleteExternalCqlLibrary).toHaveBeenCalled();
  });

  it('shows the details modal when View is clicked', () => {
    renderComponent({ externalCqlLibraryDetails: mockExternalLib });

    userEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('View External CQL Details')).toBeInTheDocument();
  });

  it("doesn't allow delete on libraries that are depended on by others", () => {
    const deleteExternalCqlLibrary = jest.fn();
    renderComponent({
      deleteExternalCqlLibrary,
      externalCqlLibraryDetails: mockExternalLib,
      externalCQLLibraryParents: {
        'cql-upload-1.0.0': [],
        'cds-connect-conversions-new-2': ['cql-upload-1.0.0']
      }
    });

    // Two libraries, one depends on the other. Dependency delete is disabled.
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    expect(deleteButtons).toHaveLength(2);
    expect(deleteButtons[0]).not.toBeDisabled();
    expect(deleteButtons[1]).toBeDisabled();

    // Delete a library that has no parents
    userEvent.click(deleteButtons[0]);

    const dialog = within(screen.getByRole('dialog'));
    userEvent.click(dialog.getByRole('button', { name: 'Delete' }));

    expect(deleteExternalCqlLibrary).toHaveBeenCalled();
  });
});
