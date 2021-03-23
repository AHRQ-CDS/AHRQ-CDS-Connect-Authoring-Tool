import axios from 'axios';

const validateArtifact = async ({ artifact, dataModel }) => {
  const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/cql/validate`, {...artifact, dataModel });

  return data;
};

export default validateArtifact;
