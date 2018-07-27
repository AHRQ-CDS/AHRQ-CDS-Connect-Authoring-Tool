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
  Condition: {
    Condition: 'code.text',
    'Date recorded': 'dateRecorded',
    'Date onset': 'onsetDateTime',
    'Date abated': 'abatementDateTime',
    Status: 'clinicalStatus'
  },
  AllergyIntolerance: {
    Substance: 'substance.text',
    Category: 'category',
    Criticality: 'criticality',
    'Date onset': 'onset',
    Status: 'status'
  },
  MedicationOrder: {
    Medication: 'medicationCodeableConcept.text',
    'Date written': 'dateWritten',
    Status: 'status'
  },
  CarePlan: {
    Category: 'category.firstObject.text',
    'First item': 'activity.firstObject.detail.code.text',
    'First item status': 'activity.firstObject.detail.status'
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
    Unit: 'valueQuantity.unit',
    Date: 'effectiveDateTime'
  },
  Immunization: {
    Vaccine: 'vaccineCode.text',
    Date: 'date',
    Status: 'status'
  },
  Procedure: {
    Procedure: 'code.text',
    'Date performed': 'performedDateTime',
    Status: 'status'
  },
  ImagingStudy: {
    'First item': 'series.firstObject.instance.firstObject.title',
    'First item modality': 'series.firstObject.modality.display',
    'First item date': 'series.firstObject.started'
  },
  DiagnosticReport: {
    Type: 'code.text',
    Category: 'category.coding.firstObject.code',
    Date: 'effectiveDateTime',
    Result: 'result.firstObject.display',
    Status: 'status'
  },
  Claim: {
    'Claim type': 'type',
    'First item type': 'item.firstObject.type.display',
    'Firt item service': 'item.firstObject.service.display',
    Status: 'use'
  },
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

  extractOtherResource = () => {
    const { patient } = this.props;
    const displayedResources = Object.keys(RESOURCE_KEYS);

    let otherResourceTypes = [];
    patient.patient.entry.forEach((entry) => {
      const resource = entry.resource.resourceType;
      if (displayedResources.indexOf(resource) === -1 && resource !== 'Patient') {
        otherResourceTypes.push(resource);
      }
    });

    return otherResourceTypes;
  }

  render() {
    const { patient } = this.props;
    const patientInfo = patient.patient.entry[0].resource;
    const patientName = patientInfo.name[0];

    let resources = [];
    patient.patient.entry.forEach((entry) => {
      const resource = entry.resource.resourceType;
      if (resources.indexOf(resource) === -1) {
        resources.push(resource);
        console.debug('resource', entry.resource);
      }
    });

    console.debug('resources: ', resources);

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

        <PatientDataSection title="Organizations" data={this.extractData('Organization')} />
        <PatientDataSection title="Conditions" data={this.extractData('Condition')} />
        <PatientDataSection title="Allergies" data={this.extractData('AllergyIntolerance')} />
        <PatientDataSection title="Medications" data={this.extractData('MedicationOrder')} />
        <PatientDataSection title="Careplans" data={this.extractData('CarePlan')} />
        <PatientDataSection title="Encounters" data={this.extractData('Encounter')} />
        <PatientDataSection title="Observations" data={this.extractData('Observation')} />
        <PatientDataSection title="Immunizations" data={this.extractData('Immunization')} />
        <PatientDataSection title="Procedures" data={this.extractData('Procedure')} />
        <PatientDataSection title="Imaging" data={this.extractData('ImagingStudy')} />
        <PatientDataSection title="Diagnostics" data={this.extractData('DiagnosticReport')} />
        <PatientDataSection title="Claims" data={this.extractData('Claim')} />
        <PatientDataSection title="Other" data={this.extractOtherResource()} />

        <hr/>
        <Inspector data={this.props.patient}/>
      </div>
    );
  }
}

PatientView.propTypes = {
  patient: patientProps
};
