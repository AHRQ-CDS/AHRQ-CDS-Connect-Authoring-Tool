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
