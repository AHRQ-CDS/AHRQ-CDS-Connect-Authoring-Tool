import axios from 'axios';

const fetchArtifact = async ({ artifactId }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/artifacts/${artifactId}`);

  return data[0];
};

export default fetchArtifact;
