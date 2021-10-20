import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell } from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

import ExternalCqlDetailsModal from './ExternalCqlDetailsModal';
import { DeleteConfirmationModal } from 'components/modals';
import { Tooltip } from 'components/elements';
import { renderDate } from 'utils/dates';
import { useButtonStyles, useTextStyles } from 'styles/hooks';

const ExternalCqlTableRow = ({ disableDeleteMessage, library, handleDeleteLibrary }) => {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const buttonStyles = useButtonStyles();
  const textStyles = useTextStyles();

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

      <TableCell align="right" className={textStyles.noWrap}>
        <Tooltip title="View Details">
          <IconButton
            aria-label="view details"
            className={buttonStyles.iconButton}
            color="primary"
            onClick={() => setShowViewDetailsModal(true)}
            variant="contained"
            size="large"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={disableDeleteMessage ? disableDeleteMessage : 'Delete'}>
          <IconButton
            aria-label="delete"
            className={buttonStyles.iconButton}
            color="secondary"
            disabled={Boolean(disableDeleteMessage)}
            onClick={() => setShowDeleteConfirmationModal(true)}
            variant="contained"
            size="large"
          >
            <DeleteIcon />
          </IconButton>
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
