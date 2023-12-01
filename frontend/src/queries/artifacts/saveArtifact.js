import axios from 'axios';
import _ from 'lodash';

const saveArtifact = async ({ artifact, artifactProps }) => {
  const updatedArtifact = {
    ...artifact,
    ...artifactProps
  };

  if (updatedArtifact._id == null) {
    const artifactWithoutId = _.omit(updatedArtifact, ['_id']);
    return axios.post(`${process.env.REACT_APP_API_URL}/artifacts`, artifactWithoutId).then(result => result.data);
  }

  return axios.put(`${process.env.REACT_APP_API_URL}/artifacts`, updatedArtifact).then(() => updatedArtifact);
};

export default saveArtifact;
