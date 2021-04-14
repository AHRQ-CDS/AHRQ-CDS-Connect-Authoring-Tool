import axios from 'axios';

const fetchExternalCqlList = async ({ artifactId }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/externalCQL/${artifactId}`);

  return data;
};

export default fetchExternalCqlList;
