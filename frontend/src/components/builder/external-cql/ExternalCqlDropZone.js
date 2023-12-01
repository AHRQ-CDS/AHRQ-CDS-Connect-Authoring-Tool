import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { Alert, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import clsx from 'clsx';

import { Modal } from 'components/elements';
import { loadArtifact } from 'actions/artifacts';
import { fetchArtifact, saveArtifact } from 'queries/artifacts';
import { addExternalCql } from 'queries/external-cql';
import { useDropZoneStyles, useSpacingStyles } from 'styles/hooks';

const ExternalCqlDropZone = () => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const [message, setMessage] = useState(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState(null);
  const [uploadCqlErrors, setUploadCqlErrors] = useState(null);
  const dispatch = useDispatch();
  const dropZoneStyles = useDropZoneStyles();
  const spacingStyles = useSpacingStyles();
  const queryClient = useQueryClient();
  const { mutate: invokeFetchArtifact } = useMutation(fetchArtifact);
  const handleLoadArtifact = useCallback(
    id => {
      invokeFetchArtifact({ artifactId: id }, { onSuccess: data => dispatch(loadArtifact(data)) });
    },
    [invokeFetchArtifact, dispatch]
  );
  const { mutateAsync: invokeSaveArtifact } = useMutation(saveArtifact);
  const handleSaveArtifact = useCallback(async () => {
    invokeSaveArtifact({ artifact }, { onSuccess: data => dispatch(loadArtifact(data)) });
  }, [invokeSaveArtifact, artifact, dispatch]);
  const addMutation = useMutation(addExternalCql, {
    onSuccess: message => {
      if (typeof message === 'string') setMessage(message);
      queryClient.invalidateQueries('externalCql');
      queryClient.invalidateQueries('modifiers');
      handleLoadArtifact(artifact._id);
    },
    onError: ({ statusText, cqlErrors }) => {
      setUploadErrorMessage(statusText || 'An error occurred.');
      setUploadCqlErrors(cqlErrors ? [...new Set(cqlErrors.map(error => error.message))] : null);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/zip': ['.zip'],
      'text/plain': ['.cql']
    },
    disabled: artifact._id == null,
    maxFiles: 1,
    onDrop: library => {
      const reader = new FileReader();
      reader.onload = async event => {
        const cqlFileName = library[0].name;
        const cqlFileType = library[0].type;
        const fileContentToSend = event.target.result.slice(event.target.result.indexOf(',') + 1);

        if (cqlFileType !== 'application/zip' || (cqlFileType === 'application/zip' && cqlFileName.endsWith('.zip'))) {
          const library = { cqlFileName, cqlFileContent: fileContentToSend, fileType: cqlFileType, artifact };
          setUploadErrorMessage(null);
          handleSaveArtifact();
          addMutation.mutate(library);
        } else {
          setUploadErrorMessage('Invalid file type. Only .cql and .zip files can be uploaded.');
        }
      };

      try {
        reader.readAsDataURL(library[0]);
      } catch (error) {
        setUploadErrorMessage('Invalid file type. Only .cql and .zip files can be uploaded.');
      }
    }
  });

  return (
    <div id="external-cql-drop-zone">
      <section className={clsx(dropZoneStyles.dropZoneSection, spacingStyles.verticalPadding)}>
        <div
          data-testid="external-cql-dropzone"
          {...getRootProps({ className: clsx('dropzone', artifact._id == null && 'disabled') })}
        >
          <input {...getInputProps()} />
          {addMutation.isLoading ? <CircularProgress /> : <CloudUploadIcon className={dropZoneStyles.dropZoneIcon} />}
          <div>Drop a valid external CQL library or zip file here, or click to browse.</div>
        </div>

        {message && (
          <Alert
            className={spacingStyles.verticalPadding}
            onClose={() => {
              setMessage(null);
              addMutation.reset();
            }}
            severity="info"
          >
            {message}
          </Alert>
        )}

        {uploadErrorMessage && (
          <Alert className={spacingStyles.verticalPadding} onClose={() => setUploadErrorMessage(null)} severity="error">
            {uploadErrorMessage}
          </Alert>
        )}

        {artifact._id == null && (
          <Alert className={spacingStyles.verticalPadding} severity="error">
            Artifact must be saved before uploading libraries.
          </Alert>
        )}

        {addMutation.isSuccess && !message && (
          <Alert className={spacingStyles.verticalPadding} onClose={() => addMutation.reset()} severity="success">
            Library successfully added.
          </Alert>
        )}

        {uploadCqlErrors?.length > 0 && (
          <Modal
            title="About your CQL..."
            submitButtonText="Close"
            isOpen
            handleCloseModal={() => setUploadCqlErrors(null)}
            handleSaveModal={() => setUploadCqlErrors(null)}
          >
            <div>
              We've detected some errors in the CQL file you attempted to upload:
              <ul>
                {uploadCqlErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </Modal>
        )}
      </section>
    </div>
  );
};

export default ExternalCqlDropZone;
