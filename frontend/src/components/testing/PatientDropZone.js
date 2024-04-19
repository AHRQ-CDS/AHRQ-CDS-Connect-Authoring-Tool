import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from 'react-query';
import { Alert, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import clsx from 'clsx';

import PatientVersionModal from './modals/PatientVersionModal';
import { addPatient } from 'queries/testing';
import { autoDetectFHIRVersion, getPatientResource, getPatientResourceType } from 'utils/patients';
import { useDropZoneStyles, useSpacingStyles } from 'styles/hooks';

const PatientDropZone = () => {
  const [showPatientUploadedMessage, setShowPatientUploadedMessage] = useState(false);
  const [showPatientVersionModal, setShowPatientVersionModal] = useState(false);
  const [showUploadError, setShowUploadError] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [versionOptions, setVersionOptions] = useState(['R4', 'STU3', 'DSTU2']);
  const queryClient = useQueryClient();
  const { mutateAsync: asyncAddPatient, isLoading: isAddingPatient } = useMutation(addPatient, {
    onSuccess: () => {
      queryClient.invalidateQueries('patients');
      setShowPatientUploadedMessage(true);
    }
  });
  const spacingStyles = useSpacingStyles();
  const dropZoneStyles = useDropZoneStyles();

  const handleCloseAlert = (event, setClose) => {
    event.stopPropagation();
    setClose(false);
  };

  const handleSelectVersion = version => {
    asyncAddPatient({ patient: patientData, fhirVersion: version });
    setShowPatientVersionModal(false);
    setVersionOptions(['R4', 'STU3', 'DSTU2']);
  };

  const handleOnDrop = useCallback(
    patient => {
      setPatientData(null);
      setShowPatientUploadedMessage(false);
      setShowUploadError(false);

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const parsedPatientData = JSON.parse(event.target.result);

          if (getPatientResourceType(parsedPatientData) === 'Bundle' && getPatientResource(parsedPatientData)) {
            setPatientData(parsedPatientData);
            const versions = autoDetectFHIRVersion({ patient: parsedPatientData });
            if (versions.length === 1) {
              // If version detected, add the patient right away
              asyncAddPatient({ patient: parsedPatientData, fhirVersion: versions[0] });
            } else {
              setVersionOptions(versions);
              setShowPatientVersionModal(true);
            }
          } else {
            setShowUploadError(true); // no patient could be found
          }
        } catch (error) {
          setShowUploadError(true); // invalid file type
        }
      };

      try {
        reader.readAsText(patient[0]);
      } catch (error) {
        console.error(error);
        setShowUploadError(true);
      }
    },
    [asyncAddPatient]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/json': ['.json']
    },
    onDrop: handleOnDrop,
    maxFiles: 1
  });

  return (
    <div id="patient-drop-zone">
      <section className={clsx(dropZoneStyles.dropZoneSection, spacingStyles.verticalPadding)}>
        <div data-testid="patient-dropzone" {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />

          {isAddingPatient ? <CircularProgress /> : <CloudUploadIcon className={dropZoneStyles.dropZoneIcon} />}

          {showUploadError && (
            <Alert
              className={spacingStyles.verticalPadding}
              onClose={event => handleCloseAlert(event, setShowUploadError)}
              severity="error"
            >
              Invalid file type. Only valid JSON FHIR<sup>®</sup> Bundles are accepted.
            </Alert>
          )}

          {showPatientUploadedMessage && (
            <Alert
              className={spacingStyles.verticalPadding}
              onClose={event => handleCloseAlert(event, setShowPatientUploadedMessage)}
              severity="success"
            >
              Patient successfully added.
            </Alert>
          )}

          <div>
            Drop a valid JSON FHIR<sup>®</sup> bundle containing a synthetic patient here, or click to browse.
          </div>

          <div className={dropZoneStyles.dropZoneWarning}>
            Do not upload any Personally Identifiable Information (PII) or Protected Health Information (PHI). Upload
            synthetic data only.
          </div>
        </div>
      </section>

      {showPatientVersionModal && (
        <PatientVersionModal
          handleCloseModal={() => setShowPatientVersionModal(false)}
          handleSelectVersion={handleSelectVersion}
          versionOptions={versionOptions}
        />
      )}
    </div>
  );
};

export default PatientDropZone;
