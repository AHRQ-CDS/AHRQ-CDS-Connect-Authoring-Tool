import React from 'react';
import nock from 'nock';
import { mockPatientR4 } from 'mocks/patients';

import { fireEvent, render, screen, waitFor } from 'utils/test-utils';
import { createDataTransferEventWithFiles, createFile } from 'utils/test_helpers';
import PatientDropZone from '../PatientDropZone';

describe('<PatientDropZone />', () => {
  afterAll(() => nock.restore());

  it('renders an error when an invalid file is uploaded', async () => {
    render(<PatientDropZone />);

    const dropEvent = createDataTransferEventWithFiles([
      createFile({ name: 'ping.json', size: 100, type: 'application/json', contents: [JSON.stringify({ ping: true })] })
    ]);

    fireEvent.drop(screen.getByTestId('patient-dropzone'), dropEvent);

    expect(await screen.findByText(/Invalid file type/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByText(/Invalid file type/)).not.toBeInTheDocument();
  });

  it('allows a patient JSON FHIR bundle to be uploaded', async () => {
    const scope = nock('http://localhost')
      .post(`/authoring/api/testing`, { patient: mockPatientR4.patient, fhirVersion: 'R4' })
      .reply(200, {});

    render(<PatientDropZone />);

    const dropEvent = createDataTransferEventWithFiles([
      createFile({
        name: 'mockPatientR4.json',
        size: 100,
        type: 'application/json',
        contents: [JSON.stringify(mockPatientR4.patient)]
      })
    ]);

    fireEvent.drop(screen.getByTestId('patient-dropzone'), dropEvent);

    expect(await screen.findByText(/Select a FHIR Version/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /R4/ }));

    expect(await screen.findByText(/Patient successfully added/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByText(/Patient successfully added/)).not.toBeInTheDocument();

    await waitFor(() => scope.done());
  });
});
