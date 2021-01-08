import axios from 'axios';

const validateCode = async ({ code, system, apiKey }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fhir/code`, {
    auth: { username: '', password: apiKey },
    params: { code, system }
  });

  return data;
};

export default validateCode;
