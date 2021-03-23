import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { Button, Checkbox, TableRow, TableCell, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@material-ui/icons';

import PatientCard from './PatientCard';
import PatientDetailsModal from './modals/PatientDetailsModal';
import { DeleteConfirmationModal } from 'components/modals';
import { deletePatient } from 'queries/testing';
import { renderDate } from 'utils/dates';
import { getPatientBirthDate, getPatientGender, getPatientFullName, getPatientVersion } from 'utils/patients';
import { useTableStyles } from 'styles/hooks';

const PatientsTableRow = ({ isDisabled, isSelected, patient, togglePatient }) => {
  const [showConfirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: asyncDeletePatient } = useMutation(deletePatient, {
    onSuccess: () => queryClient.invalidateQueries('patients')
  });
  const tableStyles = useTableStyles();
  const patientName = getPatientFullName(patient);

  return (
    <TableRow>
      <TableCell>
        {isDisabled ? (
          <Tooltip
            arrow
            title="To select this patient, first deselect all patients of other FHIR versions."
            placement="top"
          >
            <span>
              <Checkbox color="primary" inputProps={{ 'aria-label': patientName }} disabled />
            </span>
          </Tooltip>
        ) : (
          <Checkbox
            color="primary"
            inputProps={{ 'aria-label': patientName }}
            checked={isSelected}
            onChange={togglePatient}
          />
        )}
      </TableCell>

      <TableCell>{patientName}</TableCell>
      <TableCell>{getPatientBirthDate(patient)}</TableCell>
      <TableCell>{getPatientGender(patient)}</TableCell>
      <TableCell>{getPatientVersion(patient)}</TableCell>
      <TableCell>{renderDate(patient.updatedAt)}</TableCell>

      <TableCell align="right" className={tableStyles.buttonsCell}>
        <Button
          color="primary"
          onClick={() => setShowPatientDetailsModal(true)}
          startIcon={<VisibilityIcon />}
          variant="contained"
        >
          View
        </Button>

        {isSelected ? (
          <Tooltip arrow title="To delete this patient, first deselect it." placement="top">
            <span>
              <Button color="secondary" disabled startIcon={<DeleteIcon />} variant="contained">
                Delete
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            color="secondary"
            onClick={() => setConfirmDeleteModal(true)}
            startIcon={<DeleteIcon />}
            variant="contained"
          >
            Delete
          </Button>
        )}

        {showPatientDetailsModal && (
          <PatientDetailsModal handleCloseModal={() => setShowPatientDetailsModal(false)} patient={patient} />
        )}

        {showConfirmDeleteModal && (
          <DeleteConfirmationModal
            deleteType="patient"
            handleCloseModal={() => setConfirmDeleteModal(false)}
            handleDelete={() => asyncDeletePatient({ patient })}
          >
            <PatientCard patient={patient} />
          </DeleteConfirmationModal>
        )}
      </TableCell>
    </TableRow>
  );
};

PatientsTableRow.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  togglePatient: PropTypes.func.isRequired
};

export default PatientsTableRow;
