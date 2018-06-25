import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import { loadPatients, addPatient, deletePatient } from '../actions/patients';
import patientProps from '../prop-types/patient';

import PatientTable from '../components/patient/PatientTable';

class Patient extends Component {
  componentWillMount() {
    this.props.loadPatients();
  }

  addPatient = (patient) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      this.props.addPatient(JSON.parse(e.target.result));
    }.bind(this);
    reader.readAsText(patient[0]);
  }

  renderPatientsTable() {
    const { patients } = this.props;

    if (patients && patients.length > 0) {
      return (
        <PatientTable
          patients={patients}
          deletePatient={this.props.deletePatient} />
      );
    }

    return <div>No patients to show.</div>;
  }

  render() {
    return (
      <div className="artifact" id="maincontent">
        <Dropzone onDrop={this.addPatient.bind(this)} accept="application/json" multiple={false}>
          <FontAwesome name='cloud-upload' size="5x"/>
        </Dropzone>
        <div className="artifact-wrapper">
          {this.renderPatientsTable()}
        </div>
      </div>
    );
  }
}

Patient.propTypes = {
  patients: PropTypes.arrayOf(patientProps),
  loadPatients: PropTypes.func.isRequired,
  addPatient: PropTypes.func.isRequired,
  deletePatient: PropTypes.func.isRequired,
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPatients,
    addPatient,
    deletePatient,
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    patients: state.patients.patients
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Patient);
