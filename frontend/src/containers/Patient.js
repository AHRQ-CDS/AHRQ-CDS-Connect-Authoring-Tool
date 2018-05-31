import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadPatients, addPatient, deletePatient } from '../actions/patients';
import patientProps from '../prop-types/patient';

import PatientTable from '../components/artifact/PatientTable';

class Patient extends Component {
  componentWillMount() {
    this.props.loadPatients();
  }

  renderPatientsTable() {
    const { patients } = this.props;

    if (patients && patients.length > 0) {
      return (
        <ArtifactTable
          patients={patients}
          deletePatient={this.props.deletePatient} />
      );
    }

    return <div>No patients to show.</div>;
  }

  render() {
    return (
      <div className="artifact" id="maincontent">
        <div className="artifact-wrapper">
          <NewArtifactForm formType="new" addArtifact={this.props.addPatient} />

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
