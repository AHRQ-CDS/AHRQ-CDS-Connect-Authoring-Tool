import React from 'react';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import PatientCard from '../PatientCard';
import PatientDataSection from '../PatientDataSection';
import PatientJSONDataViewer from '../PatientJSONDataViewer';
import { Modal } from 'components/elements';
import { extractOtherPatientResourceData, extractPatientResourceData } from 'utils/patients';
import useStyles from '../styles';

const PatientDetailsModal = ({ handleCloseModal, patient }) => {
  const styles = useStyles();

  return (
    <Modal
      closeButtonText="Close"
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleCloseModal}
      hasCancelButton
      hideSubmitButton
      isOpen
      title="View Patient Details"
    >
      <>
        <PatientCard patient={patient} />

        <Tabs selectedTabClassName={styles.patientDataTabSelected}>
          <TabList aria-label="Patient Data Tabs" className={styles.patientDataTabList}>
            <Tab className={styles.patientDataTab}>Summary</Tab>
            <Tab className={styles.patientDataTab}>Details</Tab>
          </TabList>
          <TabPanel>
            <PatientDataSection title="Organizations" data={extractPatientResourceData(patient, 'Organization')} />
            <PatientDataSection title="Conditions" data={extractPatientResourceData(patient, 'Condition')} />
            <PatientDataSection title="Allergies" data={extractPatientResourceData(patient, 'AllergyIntolerance')} />
            <PatientDataSection title="Medications" data={extractPatientResourceData(patient, 'MedicationRequest')} />
            <PatientDataSection title="Devices" data={extractPatientResourceData(patient, 'Device')} />
            <PatientDataSection title="Careplans" data={extractPatientResourceData(patient, 'CarePlan')} />
            <PatientDataSection title="Encounters" data={extractPatientResourceData(patient, 'Encounter')} />
            <PatientDataSection title="Observations" data={extractPatientResourceData(patient, 'Observation')} />
            <PatientDataSection title="Immunizations" data={extractPatientResourceData(patient, 'Immunization')} />
            <PatientDataSection title="Procedures" data={extractPatientResourceData(patient, 'Procedure')} />
            <PatientDataSection title="Imaging" data={extractPatientResourceData(patient, 'ImagingStudy')} />
            <PatientDataSection title="Diagnostics" data={extractPatientResourceData(patient, 'DiagnosticReport')} />
            <PatientDataSection title="Claims" data={extractPatientResourceData(patient, 'Claim')} />
            <PatientDataSection title="Other" data={extractOtherPatientResourceData(patient)} />
          </TabPanel>
          <TabPanel>
            <PatientJSONDataViewer data={patient.patient} />
          </TabPanel>
        </Tabs>
      </>
    </Modal>
  );
};

PatientDetailsModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired
};

export default PatientDetailsModal;
