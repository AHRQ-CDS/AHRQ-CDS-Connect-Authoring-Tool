import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Patient extends Component {
  render() {
    const { index, bundle, deletePatient } = this.props;

    return (
      <div key={`patient-${index}`}>
        {!_.chain(bundle)
          .get('entry')
          .find({"resource": {"resourceType": "Patient"}})
          .value()
          && <div className="warning">Warning: No valid FHIR DSTU2 Patient in Bundle.</div>}
        <label>
          {_.chain(bundle)
            .get('entry')
            .find({"resource": {"resourceType": "Patient"}})
            .get('resource.name[0].given[0]')
            .value()}
          {_.chain(bundle)
            .get('entry')
            .find({"resource": {"resourceType": "Patient"}})
            .get('resource.name[0].family[0]')
            .value()}
        </label>
        <button className="button primary-button new-patient" onClick={() => { deletePatient(index); }}>
          Delete Patient
        </button>
      </div>
    );
  }
}

Patient.propTypes = {
  index: PropTypes.number.isRequired,
  bundle: PropTypes.object.isRequired,
  deletePatient: PropTypes.func.isRequired,
};
