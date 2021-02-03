import axios from 'axios';

const fetchArtifacts = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/artifacts`);

  return data;
};

export default fetchArtifacts;
