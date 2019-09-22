import React from 'react';
import ExternalCQL from '../ExternalCQL';
import { render } from '../../../utils/test-utils';

describe('<ExternalCQL />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalCQL
        addExternalLibrary={jest.fn()}
        artifact={{}}
        clearAddLibraryErrorsAndMessages={jest.fn()}
        clearExternalCqlValidationWarnings={jest.fn()}
        deleteExternalCqlLibrary={jest.fn()}
        externalCqlErrors={[]}
        externalCQLLibraryParents={{}}
        externalCqlList={[]}
        isLoadingExternalCqlDetails={false}
        librariesInUse={[]}
        loadExternalCqlLibraryDetails={jest.fn()}
        loadExternalCqlList={jest.fn()}
        {...props}
      />
    );

  it('shows form and no table when there is no data', () => {
    const { container, getByText } = renderComponent();

    expect(getByText(/No external CQL libraries to show/)).not.toBeNull();
    expect(container.querySelector('.external-cql-table')).toBeNull();
  });

  it('shows a table when there is data', () => {
    const { container, queryByText } = renderComponent({
      externalCqlList: [{
        _id: 'lib1',
        name: 'My external lib',
        details: {},
        fhirVersion: '1.0.2'
      }]
    });

    expect(queryByText(/No external CQL libraries to show/)).toBeNull();
    expect(container.querySelector('.external-cql-table')).not.toBeNull();
  });
});
