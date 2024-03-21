import React, { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Alert, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import clsx from 'clsx';

import ArtifactModal from './ArtifactModal';
import ArtifactTable from './ArtifactTable';
import { useSpacingStyles, useTextStyles } from 'styles/hooks';
import { addArtifact, deleteArtifact, fetchArtifacts, updateArtifact, duplicateArtifact } from 'queries/artifacts';

import { HelpLink } from 'components/elements';

import useStyles from './styles';

const Artifact = () => {
  const [showModal, setShowModal] = useState(false);
  const spacingStyles = useSpacingStyles();
  const textStyles = useTextStyles();
  const queryClient = useQueryClient();
  const styles = useStyles();
  const { data, error, isLoading, isSuccess } = useQuery('artifacts', () => fetchArtifacts());
  const artifacts = data ?? [];
  const resetArtifacts = () => queryClient.invalidateQueries('artifacts');
  const { mutateAsync: asyncDeleteArtifact } = useMutation(deleteArtifact, { onSuccess: resetArtifacts });
  const { mutateAsync: asyncAddArtifact } = useMutation(addArtifact, { onSuccess: resetArtifacts });
  const { mutateAsync: asyncDuplicateArtifact } = useMutation(duplicateArtifact, { onSuccess: resetArtifacts });
  const { mutateAsync: asyncUpdateArtifact } = useMutation(updateArtifact, { onSuccess: resetArtifacts });
  const handleDuplicateArtifact = useCallback(
    artifactProps => asyncDuplicateArtifact({ artifactProps }),
    [asyncDuplicateArtifact]
  );
  const handleDeleteArtifact = useCallback(artifact => asyncDeleteArtifact({ artifact }), [asyncDeleteArtifact]);
  const handleAddArtifact = useCallback(artifactProps => asyncAddArtifact({ artifactProps }), [asyncAddArtifact]);
  const handleUpdateArtifact = useCallback(
    (artifact, artifactProps) => asyncUpdateArtifact({ artifact, artifactProps }),
    [asyncUpdateArtifact]
  );

  return (
    <div className={spacingStyles.globalPadding} id="maincontent">
      {error && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}

      {isSuccess && (
        <div className={clsx(spacingStyles.minHeight, spacingStyles.verticalPadding)}>
          {/* NOTE: This alert can be used to provide a quick notice to AT users. To use it, uncomment and update the text. */}
          {/* <div className={spacingStyles.verticalPadding}>
            <Alert severity={'error'}>
              Note: Some important message to AT users
            </Alert>
          </div> */}
          <div className={styles.helpLink}>
            <Button color="primary" onClick={() => setShowModal(true)} startIcon={<AddIcon />} variant="contained">
              Create New Artifact
            </Button>
            <HelpLink linkPath="documentation/userguide#Creating_and_Managing_Artifacts" showText />
          </div>

          {artifacts.length > 0 ? (
            <ArtifactTable
              artifacts={artifacts}
              handleDeleteArtifact={handleDeleteArtifact}
              handleDuplicateArtifact={handleDuplicateArtifact}
              handleUpdateArtifact={handleUpdateArtifact}
            />
          ) : (
            <div className={clsx(spacingStyles.verticalPadding, textStyles.italic)}>No artifacts to show.</div>
          )}
        </div>
      )}

      {showModal && (
        <ArtifactModal handleAddArtifact={handleAddArtifact} handleCloseModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Artifact;
