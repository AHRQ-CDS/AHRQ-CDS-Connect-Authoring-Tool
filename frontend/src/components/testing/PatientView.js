import React, { Component } from 'react';
import Inspector from 'react-inspector';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

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

  extractOtherResources = () => {
    const { patient } = this.props;
    const displayedResources = Object.keys(RESOURCE_KEYS);

    const otherResourceTypes = [];
    patient.patient.entry.forEach((entry) => {
      const resource = entry.resource.resourceType;
      if (displayedResources.indexOf(resource) === -1 && resource !== 'Patient') { // other resource
        const foundResource = otherResourceTypes.find(r => r.resource === resource);
        if (foundResource) { // already have resource
          foundResource.count += 1;
        } else {
          otherResourceTypes.push({ resource, count: 1 });
        }
      }
    });

    return otherResourceTypes;
  }

  render() {
    const { patient } = this.props;
    const patientInfo = _.chain(patient)
      .get('patient.entry')
      .find({ resource: { resourceType: 'Patient' } })
      .get('resource')
      .value();
    const patientName = patientInfo.name[0];
    const patientAge = moment().diff(patientInfo.birthDate, 'years');

    return (
      <div className="patient-view">
        <div className="patient-view__patient">
          <div className="patient-icon"><FontAwesome name="user-circle" /></div>

          <div className="patient-data">
            <div className="patient-data-name">
              {`${patientName.given[0]} ${patientName.family[0]}`}
            </div>

            <div className="patient-data-details">
              <div className="patient-data-details-gender">{patientInfo.gender}</div>
              <div className="patient-data-details-age">{patientAge} yrs</div>
            </div>
          </div>
        </div>

        <div className="patient-view__resources">
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
          <PatientDataSection title="Other" data={this.extractOtherResources()} />
        </div>

        <hr/>
        <Inspector data={this.props.patient}/>
      </div>
    );
  }
}

PatientView.propTypes = {
  patient: patientProps
};
