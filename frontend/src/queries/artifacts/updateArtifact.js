import axios from 'axios';

const updateArtifact = async ({ artifact, artifactProps }) => {
  const updatedArtifact = {
    ...artifact,
    ...artifactProps
  };

  return axios.put(`${process.env.REACT_APP_API_URL}/artifacts`, updatedArtifact);
};

export default updateArtifact;
