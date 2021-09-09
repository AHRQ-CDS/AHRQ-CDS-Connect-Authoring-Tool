import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Link, TableCell } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, FileCopy as CopyIcon } from '@material-ui/icons';

import ArtifactModal from './ArtifactModal';
import { DeleteConfirmationModal } from 'components/modals';
import { Tooltip } from 'components/elements';
import { renderDate } from 'utils/dates';
import fhirVersionMap from 'data/fhirVersionMap';
import artifactProps from 'prop-types/artifact';
import { useButtonStyles, useTextStyles } from 'styles/hooks';

const ArtifactTableRow = ({ artifact, handleDeleteArtifact, handleDuplicateArtifact, handleUpdateArtifact }) => {
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const buttonStyles = useButtonStyles();
  const textStyles = useTextStyles();

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
        <Link component={RouterLink} to={`/build/${artifact._id}`}>
          {artifact.name}
        </Link>
      </TableCell>

      <TableCell>{artifact.version}</TableCell>
      <TableCell>{fhirVersionMap[artifact.fhirVersion]}</TableCell>
      <TableCell>{renderDate(artifact.updatedAt)}</TableCell>
      <TableCell>{renderDate(artifact.createdAt)}</TableCell>

      <TableCell align="right" className={textStyles.noWrap}>
        <Tooltip title="Edit Info">
          <IconButton
            aria-label="edit info"
            className={buttonStyles.iconButton}
            color="primary"
            onClick={() => setShowArtifactModal(true)}
            variant="contained"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Duplicate">
          <IconButton
            aria-label="duplicate"
            className={buttonStyles.iconButton}
            color="primary"
            onClick={() => handleDuplicateArtifact(artifact)}
            variant="contained"
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            className={buttonStyles.iconButton}
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
            <div>FHIR Version: {artifact.fhirVersion}</div>
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
