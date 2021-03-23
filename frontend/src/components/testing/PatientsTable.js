import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Check as CheckIcon, Lock as LockIcon } from '@material-ui/icons';

import PatientsTableRow from './PatientsTableRow';
import ExecuteCQLModal from './modals/ExecuteCQLModal';
import { VSACAuthenticationModal } from 'components/modals';
import { sortAlphabeticallyByPatientName } from 'utils/sort';
import { useSpacingStyles, useTableStyles } from 'styles/hooks';
import useStyles from './styles';

const PatientsTable = ({ handleExecuteCQL, patients }) => {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showExecuteCQLModal, setShowExecuteCQLModal] = useState(false);
  const [showVSACAuthenticationModal, setShowVSACAuthenticationModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const sortedPatients = useMemo(() => patients.sort(sortAlphabeticallyByPatientName), [patients]);
  const spacingStyles = useSpacingStyles();
  const tableStyles = useTableStyles();
  const styles = useStyles();

  const togglePatient = patient => {
    setSelectedPatients(currentSelectedPatients => {
      const newSelectedPatients = [...currentSelectedPatients];
      const patientIndex = newSelectedPatients.findIndex(p => p._id === patient._id);
      if (patientIndex !== -1) newSelectedPatients.splice(patientIndex, 1);
      else newSelectedPatients.push(patient);

      return newSelectedPatients;
    });
  };

  const executeCql = props => {
    setSelectedPatients([]);
    handleExecuteCQL(props);
  };

  return (
    <div className={spacingStyles.verticalPadding} id="patients-table">
      <div className={styles.patientsTableButtons}>
        <Button
          color="primary"
          disabled={Boolean(vsacApiKey)}
          onClick={() => setShowVSACAuthenticationModal(true)}
          variant="contained"
          startIcon={Boolean(vsacApiKey) ? <CheckIcon /> : <LockIcon />}
        >
          {Boolean(vsacApiKey) ? 'VSAC Authenticated' : 'Authenticate VSAC'}
        </Button>

        <Button
          color="primary"
          disabled={!Boolean(vsacApiKey) || selectedPatients.length === 0}
          onClick={() => setShowExecuteCQLModal(true)}
          variant="contained"
        >
          Execute CQL on Selected Patients
        </Button>
      </div>

      <TableContainer>
        <Table aria-label="patients table">
          <TableHead>
            <TableRow className={tableStyles.noWrapRow}>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients.length > 0 ? (
              sortedPatients.map(patient => (
                <PatientsTableRow
                  key={patient._id}
                  patient={patient}
                  isSelected={selectedPatients.includes(patient)}
                  isDisabled={selectedPatients.length > 0 && selectedPatients[0].fhirVersion !== patient.fhirVersion}
                  togglePatient={() => togglePatient(patient)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell>No patients to show.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showVSACAuthenticationModal && (
        <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthenticationModal(false)} />
      )}

      {showExecuteCQLModal && (
        <ExecuteCQLModal
          patients={selectedPatients}
          handleCloseModal={() => setShowExecuteCQLModal(false)}
          handleExecuteCQL={executeCql}
        />
      )}
    </div>
  );
};

PatientsTable.propTypes = {
  handleExecuteCQL: PropTypes.func.isRequired,
  patients: PropTypes.array.isRequired
};

export default PatientsTable;
