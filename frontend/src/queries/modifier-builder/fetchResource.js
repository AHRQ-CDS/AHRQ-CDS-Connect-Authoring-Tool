import axios from 'axios';
import _ from 'lodash';

export const resourceMap = {
  list_of_allergy_intolerances: { name: 'AllergyIntolerance', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_conditions: { name: 'Condition', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_devices: { name: 'Device', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_encounters: { name: 'Encounter', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_immunizations: { name: 'Immunization', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_medication_orders: { name: 'MedicationOrder', supportedVersions: ['1.0.2'] },
  list_of_medication_requests: { name: 'MedicationRequest', supportedVersions: ['3.0.0', '4.0.0'] },
  list_of_medication_statements: { name: 'MedicationStatement', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_observations: { name: 'Observation', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_procedures: { name: 'Procedure', supportedVersions: ['1.0.2', '3.0.0', '4.0.0'] },
  list_of_service_requests: { name: 'ServiceRequest', supportedVersions: ['4.0.0'] }
};

const fetchResource = async (fhirVersion, elementInstanceReturnType) => {
  const resourceName = resourceMap[elementInstanceReturnType].name;
  const resourceResponse = await axios.get(
    `${process.env.REACT_APP_API_URL}/query/resources/${resourceName}?fhirVersion=${fhirVersion}`
  );
  let data = resourceResponse.data;
  let resource = _.first(data);

  if (resourceName === 'Observation') {
    const componentResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/query/resources/Observation.component?fhirVersion=${fhirVersion}`
    );

    resource = { ...resource, component: _.first(componentResponse.data) };
  }

  if (data) {
    return resource;
  } else return new Error(`Error fetching resource for ${elementInstanceReturnType}`);
};

export default fetchResource;
