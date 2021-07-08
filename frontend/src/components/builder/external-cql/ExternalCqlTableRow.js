import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@material-ui/icons';

import ExternalCqlDetailsModal from './ExternalCqlDetailsModal';
import { DeleteConfirmationModal } from 'components/modals';
import { renderDate } from 'utils/dates';
import { useButtonStyles } from 'styles/hooks';

const ExternalCqlTableRow = ({ disableDeleteMessage, library, handleDeleteLibrary }) => {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const buttonStyles = useButtonStyles();

  const getFhirVersion = version => {
    if (version === '1.0.2') return '1.0.2 (DSTU2)';
    if (version.startsWith('3.0.')) return `${version} (STU3)`;
    if (version.startsWith('4.0.')) return `${version} (R4)`;
    return version;
  };

  return (
    <>
      <TableCell>{library.name}</TableCell>
      <TableCell>{library.version}</TableCell>
      <TableCell>{getFhirVersion(library.fhirVersion)}</TableCell>
      <TableCell>{renderDate(library.updatedAt)}</TableCell>

      <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip title="View Details" arrow>
          <IconButton
            className={buttonStyles.iconButton}
            color="primary"
            onClick={() => setShowViewDetailsModal(true)}
            variant="contained"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={disableDeleteMessage ? disableDeleteMessage : 'Delete'} arrow>
          <span>
            <IconButton
              className={buttonStyles.iconButton}
              color="secondary"
              disabled={Boolean(disableDeleteMessage)}
              onClick={() => setShowDeleteConfirmationModal(true)}
              variant="contained"
              aria-label="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      {showViewDetailsModal && (
        <ExternalCqlDetailsModal library={library} handleCloseModal={() => setShowViewDetailsModal(false)} />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          deleteType="External CQL Library"
          handleCloseModal={() => setShowDeleteConfirmationModal(false)}
          handleDelete={() => handleDeleteLibrary(library)}
        >
          <>
            <div>Name: {library.name}</div>
            <div>Version: {library.version}</div>
            {library.fhirVersion && <div>FHIR Version: {library.fhirVersion}</div>}
          </>
        </DeleteConfirmationModal>
      )}
    </>
  );
};

ExternalCqlTableRow.propTypes = {
  disableDeleteMessage: PropTypes.string,
  library: PropTypes.object.isRequired,
  handleDeleteLibrary: PropTypes.func.isRequired
};

export default ExternalCqlTableRow;
