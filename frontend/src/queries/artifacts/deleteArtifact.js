import axios from 'axios';

const deleteArtifact = async ({ artifact }) => {
  const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/artifacts/${artifact._id}`);

  return data;
};

export default deleteArtifact;
