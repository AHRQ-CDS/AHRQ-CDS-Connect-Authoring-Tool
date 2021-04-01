import axios from 'axios';

const duplicateArtifact = async ({ artifactProps }) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/artifacts/${artifactProps._id}/duplicate`);
};

export default duplicateArtifact;
