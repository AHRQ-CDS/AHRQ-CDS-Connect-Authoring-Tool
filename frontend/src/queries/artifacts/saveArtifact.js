import axios from 'axios';
import _ from 'lodash';

const saveArtifact = async artifact => {
  if (artifact._id == null) {
    const artifactWithoutId = _.omit(artifact, ['_id']);
    return axios.post(`${process.env.REACT_APP_API_URL}/artifacts`, artifactWithoutId).then(result => result.data);
  }

  return axios.put(`${process.env.REACT_APP_API_URL}/artifacts`, artifact).then(() => artifact);
};

export default saveArtifact;
