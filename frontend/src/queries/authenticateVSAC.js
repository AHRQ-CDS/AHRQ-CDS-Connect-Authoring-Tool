import axios from 'axios';

const authenticateVSAC = async ({ apiKey }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/fhir/login`,
    {},
    { auth: { username: '', password: apiKey } }
  );

  return data;
};

export default authenticateVSAC;
