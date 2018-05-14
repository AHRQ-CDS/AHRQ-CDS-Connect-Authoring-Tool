import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

export default class PatientUpload extends Component {
  addPatient = (newPatient) => {
    const patients = _.clone(this.props.patients);
		const reader = new FileReader();
    reader.onload = function(e) {
  		patients.push(JSON.parse(e.target.result));
      this.props.updatePatients(patients);
    }.bind(this);
		reader.readAsText(newPatient[0]);
  }

  deletePatient = (index) => {
    const patients = _.cloneDeep(this.props.patients);
    patients.splice(index, 1);
    this.props.updatePatients(patients);
  }

  render() {
    return (
      <div className="patient-upload">
        <Dropzone onDrop={this.addPatient.bind(this)} accept="application/json" multiple={false}>
          <p>Drop a patient .json file here, or click here to browse and select a patient .json file.</p>
        </Dropzone>
        <aside>
          {this.props.patients.map((bundle, i) => (
            <div key={`patient-${i}`}>
              <label>
                {_.chain(bundle).get('entry').find({"resource": {"resourceType": "Patient"}}).get('resource.name[0].given[0]').value()}
                {_.chain(bundle).get('entry').find({"resource": {"resourceType": "Patient"}}).get('resource.name[0].family[0]').value()}
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
