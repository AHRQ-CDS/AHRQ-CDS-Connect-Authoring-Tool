import { addMonths, addYears, differenceInDays, differenceInMonths, differenceInYears, parseISO } from 'date-fns';
import _ from 'lodash';

import patientResourceKeys from 'data/patientResourceKeys';
import getProperty from 'utils/getProperty';

export function extractOtherPatientResourceData({ fhirVersion, patient }) {
  const displayedResources = Object.keys(patientResourceKeys[fhirVersion]);

  const otherResourceTypes = [];
  patient.entry.forEach(entry => {
    const resource = entry.resource.resourceType;
    if (displayedResources.indexOf(resource) === -1 && resource !== 'Patient') {
      // other resource
      const foundResource = otherResourceTypes.find(r => r.resource === resource);
      if (foundResource) {
        // already have resource
        foundResource.count += 1;
      } else {
        otherResourceTypes.push({ resource, count: 1 });
      }
    }
  });

  return otherResourceTypes;
}

export function extractPatientResourceData({ fhirVersion, patient }, resourceName) {
  let resourceType;
  if (resourceName === 'MedicationRequest' && fhirVersion === 'DSTU2') {
    resourceType = 'MedicationOrder';
  } else {
    resourceType = resourceName;
  }

  const resources = patient.entry.filter(entry => entry.resource.resourceType === resourceType);

  const data = [];
  resources.forEach(resource => {
    const row = {};
    Object.keys(patientResourceKeys[fhirVersion][resourceType]).forEach(key => {
      row[key] = getProperty(resource.resource, patientResourceKeys[fhirVersion][resourceType][key]);
    });
    data.push(row);
  });

  return data;
}

export function getPatientAge(patientData) {
  const result = [];
  const now = new Date();
  let age = parseISO(getPatientBirthDate(patientData));

  const years = differenceInYears(now, age);
  if (years > 1) {
    result.push(`${years} years`);
    age = addYears(age, years);
  } else {
    const months = differenceInMonths(now, age);
    if (months > 1) {
      result.push(`${months} months`);
      age = addMonths(age, months);
    } else {
      result.push(`${differenceInDays(now, age)} days`);
    }
  }

  return result;
}

export function getPatientBirthDate(patientData) {
  return (
    _.chain(patientData)
      .get('patient.entry')
      .find({ resource: { resourceType: 'Patient' } })
      .get('resource.birthDate')
      .value() || 'birthdate_placeholder'
  );
}

export function getPatientGender(patientData) {
  return (
    _.chain(patientData)
      .get('patient.entry')
      .find({ resource: { resourceType: 'Patient' } })
      .get('resource.gender')
      .value() || 'gender_placeholder'
  );
}

export function getPatientId(patientData) {
  return _.chain(patientData)
    .get('patient.entry')
    .find({ resource: { resourceType: 'Patient' } })
    .get('resource.id')
    .value();
}

export function getPatientFirstName(patientData) {
  return (
    _.chain(patientData)
      .get('patient.entry')
      .find({ resource: { resourceType: 'Patient' } })
      .get('resource.name[0].given[0]')
      .value() || 'given_placeholder'
  );
}

export function getPatientLastName(patientData) {
  return (
    _.chain(patientData)
      .get('patient.entry')
      .find({ resource: { resourceType: 'Patient' } })
      .get('resource.name[0].family')
      .value() || 'family_placeholder'
  );
}

export function getPatientFullName(patientData) {
  return `${getPatientFirstName(patientData)} ${getPatientLastName(patientData)}`;
}

export function getPatientResource(patientData) {
  return _.chain(patientData)
    .get('entry')
    .find({ resource: { resourceType: 'Patient' } })
    .get('resource')
    .value();
}

export function getPatientResourceType(patientData) {
  return _.get(patientData, 'resourceType');
}

export function getPatientVersion(patientData) {
  return _.get(patientData, 'fhirVersion', 'version_placeholder');
}

function getResourceElement(patientData, resourceType, element = null) {
  if (element == null) {
    return _.chain(patientData).get('patient.entry').find({ resource: { resourceType } }).value() ?? null;
  }

  const matchingResources = _.chain(patientData).get('patient.entry').filter({ resource: { resourceType } }).value();
  return matchingResources.find(r => _.get(r, `resource.${element}`) != null);
}

export function autoDetectFHIRVersion(patientData) {
  const versions = ['R4', 'STU3', 'DSTU2'];
  const lastName = getPatientLastName(patientData);
  if (typeof lastName !== 'string' && lastName !== 'family_placeholder') {
    // DSTU2 to STU3 changed HumanName.family from 0..* to 0..1 (so it changed from array to string representation)
    _.remove(versions, v => v === 'R4' || v === 'STU3');
  } else if (lastName !== 'family_placeholder') {
    _.remove(versions, v => v === 'DSTU2');
  }
  if (getResourceElement(patientData, 'MedicationOrder')) {
    // MedicationOrder was removed after DSTU2
    _.remove(versions, v => v === 'R4' || v === 'STU3');
  }
  if (getResourceElement(patientData, 'MedicationRequest')) {
    // MedicationRequest was added in STU3
    _.remove(versions, v => v === 'DSTU2');
  }
  if (getResourceElement(patientData, 'ServiceRequest')) {
    // ServiceRequest was added in R4
    _.remove(versions, v => v === 'STU3' || v === 'DSTU2');
  }
  if (
    getResourceElement(patientData, 'Encounter', 'incomingReferral') || // changed from incomingReferral to basedOn in R4
    getResourceElement(patientData, 'Encounter', 'reason') || // removed in R4
    getResourceElement(patientData, 'MedicationStatement', 'reasonNotTaken') || // removed in R4
    getResourceElement(patientData, 'Observation', 'related') // removed in R4
  ) {
    _.remove(versions, v => v === 'R4');
  }
  if (
    getResourceElement(patientData, 'Condition', 'assertedDate') || // changed from assertedDate to recordedDate in R4
    getResourceElement(patientData, 'Condition', 'context') || // removed in R4
    getResourceElement(patientData, 'MedicationRequest', 'definition') || // removed in R4
    getResourceElement(patientData, 'MedicationRequest', 'context') || // removed in R4
    getResourceElement(patientData, 'MedicationStatement', 'taken') || // removed in R4 (was 1..1 in STU3)
    getResourceElement(patientData, 'Observation', 'context') || // changed from context to encounter in R4
    getResourceElement(patientData, 'Observation', 'comment') || // changed from comment to note in R4
    getResourceElement(patientData, 'Procedure', 'definition') || // removed in R4
    getResourceElement(patientData, 'Procedure', 'notDone') != null || // removed in R4 (boolean)
    getResourceElement(patientData, 'Procedure', 'notDoneReason') || // removed in R4
    getResourceElement(patientData, 'Procedure', 'context') // removed in R4
  ) {
    _.remove(versions, v => v === 'R4' || v === 'DSTU2');
  }
  if (
    getResourceElement(patientData, 'Condition', 'encounter') || // added in R4
    getResourceElement(patientData, 'Observation', 'encounter') || // changed from context to encounter in R4
    getResourceElement(patientData, 'Procedure', 'encounter') // added in R4
  ) {
    _.remove(versions, v => v === 'STU3');
  }
  if (
    getResourceElement(patientData, 'Condition', 'recordedDate') || // changed from assertedDate to recordedDate in R4
    getResourceElement(patientData, 'Condition', 'recorder') || // added in R4
    getResourceElement(patientData, 'Encounter', 'basedOn') || // changed from incomingReferral to basedOn in R4
    getResourceElement(patientData, 'Encounter', 'serviceType') || // added in R4
    getResourceElement(patientData, 'Encounter', 'reasonCode') || // added in R4
    getResourceElement(patientData, 'Encounter', 'reasonReference') || // added in R4
    getResourceElement(patientData, 'MedicationRequest', 'statusReason') || // added in R4
    getResourceElement(patientData, 'MedicationRequest', 'encounter') || // added in R4
    getResourceElement(patientData, 'MedicationRequest', 'performer') || // added in R4
    getResourceElement(patientData, 'MedicationRequest', 'performerType') || // added in R4
    getResourceElement(patientData, 'MedicationStatement', 'statusReason') || // added in R4
    getResourceElement(patientData, 'Observation', 'note') || // changed from comment to note in R4
    getResourceElement(patientData, 'Observation', 'partOf') || // added in R4
    getResourceElement(patientData, 'Observation', 'focus') || // added in R4
    getResourceElement(patientData, 'Observation', 'hasMember') || // added in R4
    getResourceElement(patientData, 'Observation', 'derivedFrom') || // added in R4
    getResourceElement(patientData, 'Procedure', 'statusReason') || // added in R4
    getResourceElement(patientData, 'Procedure', 'recorder') || // added in R4
    getResourceElement(patientData, 'Procedure', 'asserter') // added in R4
  ) {
    _.remove(versions, v => v === 'STU3' || v === 'DSTU2');
  }
  return versions;
}
