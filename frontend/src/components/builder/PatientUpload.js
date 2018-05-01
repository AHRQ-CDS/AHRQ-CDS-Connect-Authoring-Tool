import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

export default class PatientUpload extends Component {
  addPatients = (newPatients) => {
    const patients = _.clone(this.props.patients);
    patients.push(...newPatients);
    this.props.updatePatients(patients);
  }

  deletePatient = (index) => {
    const patients = _.cloneDeep(this.props.patients);
    patients.splice(index, 1);
    this.props.updatePatients(patients);
  }

  render() {
    return (
      <div className="patient-upload">
        <Dropzone onDrop={this.addPatients.bind(this)}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
        <aside>
          {this.props.patients.map((patient, i) => (
            <div key={`patient-${i}`}>
              <label>
                {patient.name} - {patient.size}
                <button className="button primary-button new-patient" onClick={() => { this.deletePatient(i); }}>
                  Delete Patient
                </button>
              </label>
            </div>
          ))}
        </aside>

      </div>
    );
  }
}

PatientUpload.propTypes = {
  patients: PropTypes.array.isRequired,
  updatePatients: PropTypes.func.isRequired
};
