import axios from 'axios';

const addPatient = async ({ patient, fhirVersion }) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/testing`, { patient, fhirVersion }).then(result => result.data);
};

export default addPatient;
