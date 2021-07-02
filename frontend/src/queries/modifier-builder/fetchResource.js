import { dstu2_resources, stu3_resources, r4_resources } from 'data/modifier-builder';

const resourcesDataMap = {
  '1.0.2': dstu2_resources,
  '3.0.0': stu3_resources,
  '4.0.0': r4_resources
};

const resourceMap = {
  list_of_observations: 'Observation',
  list_of_conditions: 'Condition',
  list_of_medication_statements: 'MedicationStatement',
  list_of_medication_requests: 'MedicationRequest',
  list_of_procedures: 'Procedure',
  list_of_allergy_intolerances: 'AllergyIntolerance',
  list_of_encounters: 'Encounter',
  list_of_immunizations: 'Immunization',
  list_of_devices: 'Device',
  list_of_service_requests: 'ServiceRequest',
  list_of_medication_orders: 'MedicationOrder'
};

// TODO: hook up to API
const fetchResource = async (fhirVersion, elementInstanceReturnType) => {
  const resourceName = resourceMap[elementInstanceReturnType];
  if (resourceName == null) return null;

  let resource = resourcesDataMap[fhirVersion].resources.find(resource => resource.name === resourceName);
  if (resourceName === 'Observation') {
    const observationComponentResource = resourcesDataMap[fhirVersion].resources.find(
      resource => resource.name === 'Observation.component'
    );
    resource = { ...resource, component: observationComponentResource };
  }

  if (!resource) return new Error('Error fetching resource');
  return resource;
};

export default fetchResource;
