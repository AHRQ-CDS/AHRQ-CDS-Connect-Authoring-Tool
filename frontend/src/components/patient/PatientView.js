import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Inspector from 'react-inspector';

import patientProps from '../../prop-types/patient';

const RESOURCE_KEYS = {
  'Patient': [
    family_name: 'name[0].family[0]',
    given_name: 'name[0].given[0]'
  ]
};

export default class PatientView extends Component {
  extractData = (resourceType) => {
    const { patient } = this.props;
    const resources = patient.patient.entry.find(entry => entry.resource.resourceType === resourceType);

    let data = [];
    resources.forEach((resource) => {
      RESOURCE_KEYS[resourceType].map((element) => {
        data.push({ element.key: resource[value] });
      });
    });

    console.debug('data: ', data);
    return data;
  }

  renderHeader = (title) => {
    return (
      <div className="patient-view__header">
        <div className="header-title">{title}</div>
        <div className="header-divider"></div>
      </div>
    );
  }

  renderSection = (type) => {
    const data = this.extractData(type);

    return (
      <div className="patient-view__section">
        {this.renderHeader(type)}
        {data && <div className="section-data">{this.extractData('Patient')}</div>}
      </div>
    );
  }

  render() {
    const { patient } = this.props;

    return (
      <div className="patient-view">
        {this.renderSection('Patient')}

        <Inspector data={this.props.patient}/>
      </div>
    );
  }
}

PatientView.propTypes = {
  patient: patientProps
};
