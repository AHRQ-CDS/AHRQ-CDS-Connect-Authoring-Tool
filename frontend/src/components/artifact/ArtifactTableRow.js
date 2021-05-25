import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, FileCopy as CopyIcon } from '@material-ui/icons';

import ArtifactModal from './ArtifactModal';
import { Link } from 'components/elements';
import { DeleteConfirmationModal } from 'components/modals';
import { renderDate } from 'utils/dates';
import artifactProps from 'prop-types/artifact';
import { useTextStyles } from 'styles/hooks';

import useStyles from './styles';

const ArtifactTableRow = ({ artifact, handleDeleteArtifact, handleDuplicateArtifact, handleUpdateArtifact }) => {
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const textStyles = useTextStyles();
  const styles = useStyles();

  const deleteArtifact = useCallback(
    artifact => {
      handleDeleteArtifact(artifact);
      setShowDeleteConfirmationModal(false);
    },
    [handleDeleteArtifact]
  );

  return (
    <>
      <TableCell className={textStyles.bold}>
        <Link href={`${process.env.PUBLIC_URL}/build/${artifact._id}`} text={artifact.name} sameTab />
      </TableCell>

      <TableCell>{artifact.version}</TableCell>
      <TableCell>{renderDate(artifact.updatedAt)}</TableCell>
      <TableCell>{renderDate(artifact.createdAt)}</TableCell>

      <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip title="Edit Info" arrow>
          <IconButton
            className={styles.artifactButton}
            color="primary"
            onClick={() => setShowArtifactModal(true)}
            variant="contained"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Duplicate" arrow>
          <IconButton
            className={styles.artifactButton}
            color="primary"
            onClick={() => handleDuplicateArtifact(artifact)}
            variant="contained"
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete" arrow>
          <IconButton
            className={styles.artifactButton}
            color="secondary"
            onClick={() => setShowDeleteConfirmationModal(true)}
            variant="contained"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>

      {showArtifactModal && (
        <ArtifactModal
          artifactEditing={artifact}
          handleCloseModal={() => setShowArtifactModal(false)}
          handleUpdateArtifact={handleUpdateArtifact}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          deleteType="CDS Artifact"
          handleCloseModal={() => setShowDeleteConfirmationModal(false)}
          handleDelete={() => deleteArtifact(artifact)}
        >
          <>
            <div>Name: {artifact.name}</div>
            <div>Version: {artifact.version}</div>
          </>
        </DeleteConfirmationModal>
      )}
    </>
  );
};

ArtifactTableRow.propTypes = {
  artifact: artifactProps.isRequired,
  handleDeleteArtifact: PropTypes.func.isRequired,
  handleUpdateArtifact: PropTypes.func.isRequired
};

export default ArtifactTableRow;
