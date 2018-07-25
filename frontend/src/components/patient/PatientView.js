import React, { Component } from 'react';
import Inspector from 'react-inspector';

import getProperty from '../../utils/getProperty';
import patientProps from '../../prop-types/patient';

import PatientDataSection from './PatientDataSection';

const RESOURCE_KEYS = {
  Organization: {
    Name: 'name',
    Type: 'type.coding.firstObject.display',
    'Street address': 'address.firstObject.line.firstObject',
    City: 'address.firstObject.city',
    State: 'address.firstObject.state',
    'Zip code': 'address.firstObject.postalCode',
    Phone: 'telecom.firstObject.value'
  },
  Encounter: {
    Type: 'type.firstObject.text',
    'Start date': 'period.start',
    'End date': 'period.end',
    Status: 'status'
  },
  Observation: {
    Category: 'category.text',
    Type: 'code.text',
    Value: 'valueQuantity.value',
    Unit: 'valueQuantity.unit'
  },
  Immunization: {
    Vaccine: 'vaccineCode.text',
    Date: 'date',
    Status: 'status'
  },
  Claim: {
    Type: 'type',
    'First item': 'item.firstObject.type.display'
  },
  Procedure: {
    Procedure: 'code.text',
    Date: 'performedDateTime'
  }
};

export default class PatientView extends Component {
  extractData = (resourceType) => {
    const { patient } = this.props;
    const resources = patient.patient.entry.filter(entry => entry.resource.resourceType === resourceType);

    const data = [];
    resources.forEach((resource) => {
      const row = {};
      Object.keys(RESOURCE_KEYS[resourceType]).forEach((key) => {
        row[key] = getProperty(resource.resource, RESOURCE_KEYS[resourceType][key]);
      });
      data.push(row);
    });

    return data;
  }

  render() {
    const { patient } = this.props;
    const patientInfo = patient.patient.entry[0].resource;
    const patientName = patientInfo.name[0];

    return (
      <div className="patient-view">
        <div className="patient-view__patient-data">
          <div className="patient-data-row">
            <div className="patient-data-label">Patient name:</div>
            <div className="patient-data-text">{`${patientName.given[0]} ${patientName.family[0]}`}</div>
          </div>

          <div className="patient-data-row">
            <div className="patient-data-label">Patient gender:</div>
            <div className="patient-data-text">{patientInfo.gender}</div>
          </div>

          <div className="patient-data-row">
            <div className="patient-data-label">Patient DOB:</div>
            <div className="patient-data-text">{patientInfo.birthDate}</div>
          </div>
        </div>

        <PatientDataSection title='Organizations' data={this.extractData('Organization')} />
        <PatientDataSection title='Encounters' data={this.extractData('Encounter')} />
        <PatientDataSection title='Observations' data={this.extractData('Observation')} />
        <PatientDataSection title='Immunizations' data={this.extractData('Immunization')} />
        <PatientDataSection title='Claims' data={this.extractData('Claim')} />
        <PatientDataSection title='Procedures' data={this.extractData('Procedure')} />

        <hr/>
        <Inspector data={this.props.patient}/>
      </div>
    );
  }
}

PatientView.propTypes = {
  patient: patientProps
};
