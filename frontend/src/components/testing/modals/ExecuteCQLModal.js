import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import _ from 'lodash';

import TestingParameters from '../TestingParameters';
import { Dropdown, Modal } from 'components/elements';
import { fetchArtifacts } from 'queries/artifacts';
import fhirVersionMap from 'data/fhirVersionMap';

const ExecuteCQLModal = ({ patients, handleCloseModal, handleExecuteCQL }) => {
  const [artifactToExecute, setArtifactToExecute] = useState(null);
  const [paramsToExecute, setParamsToExecute] = useState([]);
  const { data: artifacts } = useQuery('artifacts', () => fetchArtifacts());

  const fhirVersion = patients[0].fhirVersion;
  const validArtifactsToExecute = useMemo(
    () =>
      artifacts?.filter(
        artifact => artifact.fhirVersion === '' || fhirVersionMap[artifact.fhirVersion] === fhirVersion
      ) || [],
    [artifacts, fhirVersion]
  );
  const artifactOptions = useMemo(
    () => validArtifactsToExecute.map(artifact => ({ value: artifact.name, label: artifact.name })),
    [validArtifactsToExecute]
  );
  const handleSubmit = () => {
    let version = Object.keys(fhirVersionMap).find(key => fhirVersionMap[key] === fhirVersion);
    if (version === '4.0.x') {
      version = artifactToExecute.fhirVersion === '4.0.0' ? '4.0.0' : '4.0.1';
    }
    const dataModel = { name: 'FHIR', version };

    handleExecuteCQL({
      artifact: artifactToExecute,
      params: paramsToExecute,
      dataModel,
      selectedPatients: patients.map(patient => patient.patient)
    });
    handleCloseModal();
  };

  const selectArtifactToExecute = artifactName => {
    const artifact = validArtifactsToExecute.find(artifact => artifact.name === artifactName);

    if (artifact) {
      let params = [];
      if (artifact.parameters) {
        params = artifact.parameters.map(p => ({
          name: p.name,
          type: p.type,
          value: _.clone(p.value)
        }));
      }

      setArtifactToExecute(artifact);
      setParamsToExecute(params);
    } else {
      setArtifactToExecute(null);
      setParamsToExecute([]);
    }
  };

  return (
    <Modal
      title="Execute CQL on Selected Patients"
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleSubmit}
      hasCancelButton
      isOpen
      submitButtonText="Execute CQL"
      submitDisabled={artifactToExecute == null}
    >
      <div className="patient-table__modal modal__content">
        <div className="select-label">FHIR Compatible Artifacts:</div>

        <Dropdown
          id="select-artifact"
          hiddenLabel={Boolean(artifactToExecute)}
          label={artifactToExecute ? null : 'Select...'}
          onChange={event => selectArtifactToExecute(event.target.value)}
          options={artifactOptions}
          value={artifactToExecute ? artifactToExecute.name : ''}
        />

        <TestingParameters parameters={paramsToExecute} handleUpdateParameters={setParamsToExecute} />
      </div>
    </Modal>
  );
};

ExecuteCQLModal.propTypes = {
  patients: PropTypes.array.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleExecuteCQL: PropTypes.func.isRequired
};

export default ExecuteCQLModal;
