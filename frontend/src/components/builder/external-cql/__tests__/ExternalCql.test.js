import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import nock from 'nock';
import ExternalCql from '../ExternalCql';
import { fireEvent, render, screen, userEvent, waitForElementToBeRemoved, within } from 'utils/test-utils';
import { createDataTransferEventWithFiles, createFile } from 'utils/test_helpers';
import { mockArtifact } from 'mocks/artifacts';
import {
  FHIRHelpers,
  mockExternalCqlLibrary,
  mockExternalCqlLibraryDependency,
  mockR4,
  mockStu3,
  mockStu3ExternalCqlLibrary,
  mockWithErrors
} from 'mocks/external-cql';

describe('<ExternalCQL />', () => {
  const renderComponent = ({ artifact = mockArtifact, librariesInUse = [] } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact, librariesInUse } }, applyMiddleware(thunk))}>
        <ExternalCql />
      </Provider>
    );

  describe('when the artifact is new and has not been saved', () => {
    it('renders a table with no data', async () => {
      renderComponent({ artifact: { ...mockArtifact, _id: undefined } });

      expect(await screen.findByText(/No external CQL libraries to show/i)).toBeInTheDocument();
    });
  });

  describe('when there are no uploaded libraries', () => {
    beforeEach(() => {
      nock('http://localhost').get(`/authoring/api/externalCQL/${mockArtifact._id}`).reply(200, []);
    });

    it('renders a table with no data', async () => {
      renderComponent();

      expect(await screen.findByText(/No external CQL libraries to show/i)).toBeInTheDocument();
    });
  });

  describe('when a library is uploaded', () => {
    it('uploads a library successfully', async () => {
      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [])
        .put('/authoring/api/artifacts', mockArtifact)
        .reply(200, 'OK')
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL', {
          library: {
            cqlFileName: 'Mock-stu3.cql',
            cqlFileContent: btoa(mockStu3),
            fileType: 'text/plain',
            artifact: mockArtifact
          }
        })
        .reply(200, { n: 1, nModified: 1, ok: 1 })
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [mockStu3ExternalCqlLibrary])
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact]);

      renderComponent();

      const dropEvent = createDataTransferEventWithFiles([
        createFile({
          name: 'Mock-stu3.cql',
          size: 100,
          type: 'text/plain',
          contents: [mockStu3]
        })
      ]);

      fireEvent.drop(screen.getByTestId('external-cql-dropzone'), dropEvent);

      expect(await screen.findByText(/Library successfully added/i)).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: /AgeSTU3/i })).toBeInTheDocument();
    });

    it('disables the drop zone and displays the correct message when the artifact has not yet been saved', async () => {
      renderComponent({ artifact: { ...mockArtifact, _id: undefined } });

      expect(await screen.findByText(/Artifact must be saved before uploading libraries/i)).toBeInTheDocument();
      expect(screen.getByTestId('external-cql-dropzone')).toHaveClass('disabled');
    });

    it('displays the correct error when an incorrect file type is uploaded', async () => {
      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [mockStu3ExternalCqlLibrary])
        .put('/authoring/api/artifacts', mockArtifact)
        .reply(200, 'OK');

      renderComponent();

      const dropEvent = createDataTransferEventWithFiles([
        createFile({
          name: 'Mock-R4.txt',
          size: 100,
          type: 'application/zip',
          contents: ['text']
        })
      ]);

      fireEvent.drop(screen.getByTestId('external-cql-dropzone'), dropEvent);

      expect(await screen.findByText(/Invalid file type/i)).toBeInTheDocument();
    });

    it('displays the correct error when a library with a different fhir version is uploaded', async () => {
      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [mockStu3ExternalCqlLibrary])
        .put('/authoring/api/artifacts', mockArtifact)
        .reply(200, 'OK')
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL', {
          library: {
            cqlFileName: 'Mock-R4.cql',
            cqlFileContent: btoa(mockR4),
            fileType: 'text/plain',
            artifact: mockArtifact
          }
        })
        .reply(200, 'Unable to upload external CQL because a library using a different version of FHIR', {
          'Content-Type': 'text/html'
        })
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact]);

      renderComponent();

      const dropEvent = createDataTransferEventWithFiles([
        createFile({
          name: 'Mock-R4.cql',
          size: 100,
          type: 'text/plain',
          contents: [mockR4]
        })
      ]);

      fireEvent.drop(screen.getByTestId('external-cql-dropzone'), dropEvent);

      expect(
        await screen.findByText(/Unable to upload external CQL because a library using a different version of FHIR/i)
      ).toBeInTheDocument();
    });

    it('will display the CQL error modal for attempting to upload a library with errors', async () => {
      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [mockStu3ExternalCqlLibrary])
        .put('/authoring/api/artifacts', mockArtifact)
        .reply(200, 'OK')
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL', {
          library: {
            cqlFileName: 'Mock-With-Errors.cql',
            cqlFileContent: btoa(mockWithErrors),
            fileType: 'text/plain',
            artifact: mockArtifact
          }
        })
        .reply(400, [{ message: 'Could not load source for library A.' }]);

      renderComponent();

      const dropEvent = createDataTransferEventWithFiles([
        createFile({
          name: 'Mock-With-Errors.cql',
          size: 100,
          type: 'text/plain',
          contents: [mockWithErrors]
        })
      ]);

      fireEvent.drop(screen.getByTestId('external-cql-dropzone'), dropEvent);

      expect(await screen.findByText(/An Error Occurred/i)).toBeInTheDocument();
      expect(await screen.findByText(/we've detected some errors in the cql file you attempted to upload/i));
      expect(await screen.findByText(/Could not load source for library A/i));
    });
  });

  describe('when there are uploaded libraries', () => {
    let scope;
    beforeEach(() => {
      scope = nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [mockStu3ExternalCqlLibrary]);
    });

    it('renders a table with data', async () => {
      renderComponent();
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      expect(screen.getByRole('cell', { name: /agestu3/i })).toBeInTheDocument();
    });

    it('can view details of a library', async () => {
      renderComponent();
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      userEvent.click(screen.getAllByRole('button', { name: /view details/i })[0]);
      const dialog = within(screen.getByRole('dialog'));
      expect(dialog.getByText(/view external cql details/i)).toBeInTheDocument();
      expect(dialog.getByRole('region', { name: 'Define (7)' })).toBeInTheDocument();
      expect(dialog.getAllByRole('cell')).toHaveLength(14);
    });

    it('can delete a library', async () => {
      scope
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .delete(`/authoring/api/externalCQL/${mockStu3ExternalCqlLibrary._id}`)
        .reply(200, 'OK')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, []);

      renderComponent();
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      userEvent.click(screen.getByRole('button', { name: /delete/i }));

      const dialog = within(screen.getByRole('dialog'));
      expect(dialog.getByText(/delete external cql library confirmation/i)).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: /delete/i }));

      expect(await screen.findByText(/No external CQL libraries to show/i)).toBeInTheDocument();
    });

    it('cannot delete a library that is used', async () => {
      renderComponent({ librariesInUse: ['AgeSTU3'] });
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
      expect(
        screen.getByRole('cell', { name: /to delete this library, first remove all references to it\./i })
      ).toBeInTheDocument();
    });
  });

  describe('when there are dependent libraries', () => {
    it('cannot delete a library that is a dependent on another library', async () => {
      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [mockExternalCqlLibrary, mockExternalCqlLibraryDependency]);

      renderComponent();
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      expect(screen.getAllByRole('button', { name: /delete/i })[1]).toBeDisabled();
      expect(
        screen.getByRole('cell', { name: /to delete this library, first remove all libraries that depend on it\./i })
      ).toBeInTheDocument();
    });
  });

  describe('when a library is uploaded that the AT already includes', () => {
    it('does not upload the library and displays an info banner', async () => {
      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [])
        .put('/authoring/api/artifacts', mockArtifact)
        .reply(200, 'OK')
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL', {
          library: {
            cqlFileName: 'fhir-helpers.cql',
            cqlFileContent: btoa(FHIRHelpers),
            fileType: 'text/plain',
            artifact: mockArtifact
          }
        })
        .reply(200, 'The CDS Authoring Tool already includes a version of the same library by default')
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, [])
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact]);

      renderComponent();
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      const dropEvent = createDataTransferEventWithFiles([
        createFile({
          name: 'fhir-helpers.cql',
          size: 100,
          type: 'text/plain',
          contents: [FHIRHelpers]
        })
      ]);

      fireEvent.drop(screen.getByTestId('external-cql-dropzone'), dropEvent);

      expect(
        await screen.findByText(/the CDS Authoring Tool already includes a version of the same library by default/i)
      );
      expect(await screen.findByText(/No external CQL libraries to show/i)).toBeInTheDocument();
    });
  });
});
