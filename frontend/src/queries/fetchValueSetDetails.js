import axios from 'axios';

const fetchValueSetDetails = async ({ oid, apiKey }) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fhir/vs/${oid}`, {
      auth: { username: '', password: apiKey }
    });

    return data.codes;
  } catch (error) {
    if (error?.response?.status === 404) {
      throw new Error('Unable to retrieve codes for this value set.');
    }
    throw error;
  }
};

export default fetchValueSetDetails;
