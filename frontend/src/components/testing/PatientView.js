import React, { Component } from 'react';
import Inspector from 'react-inspector';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import getProperty from '../../utils/getProperty';
import patientProps from '../../prop-types/patient';

import PatientDataSection from './PatientDataSection';

const RESOURCE_KEYS = {
  DSTU2: {
    Organization: {
      Name: 'name',
      Type: 'CodeableConcept:type',
      'Street address': 'address.firstObject.line.firstObject',
      City: 'address.firstObject.city',
      State: 'address.firstObject.state',
      'Zip code': 'address.firstObject.postalCode',
      Contact: 'telecom.firstObject.value'
    },
    Condition: {
      Condition: 'CodeableConcept:code',
      'Date recorded': 'dateRecorded',
      Onset: 'onset[x]',
      Abatement: 'abatement[x]',
      Status: 'clinicalStatus'
    },
    AllergyIntolerance: {
      Substance: 'CodeableConcept:substance',
      Category: 'category',
      Criticality: 'criticality',
      Onset: 'onset',
      Status: 'status'
    },
    MedicationOrder: {
      Medication: 'medication[x]',
      'Date written': 'dateWritten',
      Status: 'status'
    },
    CarePlan: {
      'First category': 'CodeableConcept:category.firstObject',
      'First activity': 'CodeableConcept:activity.firstObject.detail.code',
      'First activity status': 'activity.firstObject.detail.status'
    },
    Encounter: {
      'First Type': 'CodeableConcept:type.firstObject',
      'Start date': 'period.start',
      'End date': 'period.end',
      Status: 'status'
    },
    Observation: {
      Category: 'CodeableConcept:category',
      Type: 'CodeableConcept:code',
      Value: 'value[x]',
      Effective: 'effective[x]',
      Issued: 'issued'
    },
    Immunization: {
      Vaccine: 'CodeableConcept:vaccineCode',
      Date: 'date',
      Status: 'status'
    },
    Procedure: {
      Procedure: 'CodeableConcept:code',
      Performed: 'performed[x]',
      Status: 'status'
    },
    ImagingStudy: {
      'First item': 'series.firstObject.instance.firstObject.title',
      'First item modality': 'Coding:series.firstObject.modality',
      'First item date': 'series.firstObject.started'
    },
    DiagnosticReport: {
      Type: 'CodeableConcept:code',
      Category: 'CodeableConcept:category',
      Effective: 'effective[x]',
      'First Result': 'Coding:result.firstObject',
      Status: 'status'
    },
    Claim: {
      'Claim type': 'type',
      'First item type': 'Coding:item.firstObject.type',
      'First item service': 'Coding:item.firstObject.service',
      Use: 'use'
    },
    Device: {
      Type: 'CodeableConcept:type',
      Status: 'status'
    }
  },
  STU3: {
    Organization: {
      Name: 'name',
      Type: 'CodeableConcept:type.firstObject',
      'Street address': 'address.firstObject.line.firstObject',
      City: 'address.firstObject.city',
      State: 'address.firstObject.state',
      'Zip code': 'address.firstObject.postalCode',
      Contact: 'telecom.firstObject.value'
    },
    Condition: {
      Condition: 'CodeableConcept:code',
      'Date recorded': 'assertedDate',
      Onset: 'onset[x]',
      Abatement: 'abatement[x]',
      Status: 'clinicalStatus'
    },
    AllergyIntolerance: {
      Substance: 'CodeableConcept:code',
      Category: 'CodeableConcept:category.firstObject',
      Criticality: 'criticality',
      Onset: 'onset[x]',
      Status: 'clinicalStatus'
    },
    MedicationRequest: {
      Medication: 'medication[x]',
      'Date written': 'authoredOn',
      Status: 'status'
    },
    CarePlan: {
      'First category': 'CodeableConcept:category.firstObject',
      'First activity': 'CodeableConcept:activity.firstObject.detail.code',
      'First activity status': 'activity.firstObject.detail.status'
    },
    Encounter: {
      'First Type': 'CodeableConcept:type.firstObject',
      'Start date': 'period.start',
      'End date': 'period.end',
      Status: 'status'
    },
    Observation: {
      Category: 'CodeableConcept:category.firstObject',
      Type: 'CodeableConcept:code',
      Value: 'value[x]',
      Effective: 'effective[x]',
      Issued: 'issued'
    },
    Immunization: {
      Vaccine: 'CodeableConcept:vaccineCode',
      Date: 'date',
      Status: 'status'
    },
    Procedure: {
      Procedure: 'CodeableConcept:code',
      Performed: 'performed[x]',
      Status: 'status'
    },
    ImagingStudy: {
      'First item': 'series.firstObject.instance.firstObject.title',
      'First item modality': 'Coding:series.firstObject.modality',
      'First item date': 'series.firstObject.started'
    },
    DiagnosticReport: {
      Type: 'CodeableConcept:code',
      Category: 'CodeableConcept:category',
      Effective: 'effective[x]',
      Conclusion: 'conclusion',
      Status: 'status'
    },
    Claim: {
      'Claim type': 'CodeableConcept:type',
      'First item service': 'CodeableConcept:item.firstObject.service',
      Use: 'use',
      Status: 'status'
    },
    Device: {
      Type: 'CodeableConcept:type',
      Status: 'status'
    }
  },
  R4: {
    Organization: {
      Name: 'name',
      Type: 'CodeableConcept:type.firstObject',
      'Street address': 'address.firstObject.line.firstObject',
      City: 'address.firstObject.city',
      State: 'address.firstObject.state',
      'Zip code': 'address.firstObject.postalCode',
      Contact: 'telecom.firstObject.value'
    },
    Condition: {
      Condition: 'CodeableConcept:code',
      'Date recorded': 'recordedDate',
      Onset: 'onset[x]',
      Abatement: 'abatement[x]',
      Status: 'CodeableConcept:clinicalStatus'
    },
    AllergyIntolerance: {
      Substance: 'CodeableConcept:code',
      Category: 'CodeableConcept:category.firstObject',
      Criticality: 'criticality',
      Onset: 'onset[x]',
      Status: 'CodeableConcept:clinicalStatus'
    },
    MedicationRequest: {
      Medication: 'medication[x]',
      'Date written': 'authoredOn',
      Status: 'status'
    },
    CarePlan: {
      'First category': 'CodeableConcept:category.firstObject',
      'First activity': 'CodeableConcept:activity.firstObject.detail.code',
      'First activity status': 'activity.firstObject.detail.status'
    },
    Encounter: {
      'First Type': 'CodeableConcept:type.firstObject',
      'Start date': 'period.start',
      'End date': 'period.end',
      Status: 'status'
    },
    Observation: {
      Category: 'CodeableConcept:category.firstObject',
      Type: 'CodeableConcept:code',
      Value: 'value[x]',
      Effective: 'effective[x]',
      Issued: 'issued'
    },
    Immunization: {
      Vaccine: 'CodeableConcept:vaccineCode',
      Date: 'occurrence[x]',
      Status: 'status'
    },
    Procedure: {
      Procedure: 'CodeableConcept:code',
      Performed: 'performed[x]',
      Status: 'status'
    },
    ImagingStudy: {
      'First item': 'series.firstObject.instance.firstObject.title',
      'First item modality': 'Coding:series.firstObject.modality',
      'First item date': 'series.firstObject.started'
    },
    DiagnosticReport: {
      Type: 'CodeableConcept:code',
      Category: 'CodeableConcept:category.firstObject',
      Effective: 'effective[x]',
      Conclusion: 'conclusion',
      Status: 'status'
    },
    Claim: {
      'Claim type': 'CodeableConcept:type',
      'First item service': 'CodeableConcept:item.firstObject.productOrService',
      Use: 'use',
      Status: 'status'
    },
    Device: {
      Type: 'CodeableConcept:type',
      Status: 'status'
    }
  }
};

export default class PatientView extends Component {
  extractData = (resourceName) => {
    const { patient } = this.props;

    let resourceType;
    if (resourceName === 'MedicationRequest' && patient.fhirVersion === 'DSTU2') {
      resourceType = 'MedicationOrder';
    } else {
      resourceType = resourceName;
    }

    const resources = patient.patient.entry.filter(entry => entry.resource.resourceType === resourceType);

    const data = [];
    resources.forEach((resource) => {
      const row = {};
      Object.keys(RESOURCE_KEYS[patient.fhirVersion][resourceType]).forEach((key) => {
        row[key] = getProperty(resource.resource, RESOURCE_KEYS[patient.fhirVersion][resourceType][key]);
      });
      data.push(row);
    });

    return data;
  }

  extractOtherResources = () => {
    const { patient } = this.props;
    const displayedResources = Object.keys(RESOURCE_KEYS[patient.fhirVersion]);

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

    if (!patientInfo) {
      return null;
    }

    const patientName =
      patientInfo.name ? patientInfo.name[0] : { given: ['given_placeholder'], family: 'family_placeholder' };
    const patientAge = moment().diff(patientInfo.birthDate, 'years');

    return (
      <div className="patient-view">
        <div className="patient-view__patient">
          <div className="patient-icon"><FontAwesomeIcon icon={faUserCircle} /></div>

          <div className="patient-data">
            <div className="patient-data-name">
              {`${patientName.given[0]} ${patientName.family}`}
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
          <PatientDataSection title="Medications" data={this.extractData('MedicationRequest')} />
          <PatientDataSection title="Devices" data={this.extractData('Device')} />
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
