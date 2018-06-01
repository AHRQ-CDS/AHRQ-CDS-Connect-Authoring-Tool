import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Cql from 'cql-execution';
import CqlFhir from 'cql-exec-fhir';
import CqlVsac from 'cql-exec-vsac';

import Patient from './Patient';

export default class PatientRun extends Component {
  addPatient = (newPatient) => {
    const patients = _.clone(this.props.patients);
    const reader = new FileReader();
    reader.onload = function (e) {
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
      <div className="patient-run">
        <Dropzone onDrop={this.addPatient.bind(this)} accept="application/json" multiple={false}>
          <p>Select a .json file that is a valid FHIR DSTU2 Bundle containing a Patient and its associated resources.</p>
        </Dropzone>
        <aside>
          {this.props.patients.map((bundle, i) => (
            <Patient
              index={i}
              bundle={bundle}
              deletePatient={this.deletePatient}
            />
          ))}
        </aside>
      </div>
    );
  }
}

PatientRun.propTypes = {
  patients: PropTypes.array.isRequired,
  updatePatients: PropTypes.func.isRequired
};
