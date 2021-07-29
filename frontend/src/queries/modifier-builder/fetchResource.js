import axios from 'axios';
import _ from 'lodash';

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

const fetchResource = async (fhirVersion, elementInstanceReturnType) => {
  const resourceName = resourceMap[elementInstanceReturnType];
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
