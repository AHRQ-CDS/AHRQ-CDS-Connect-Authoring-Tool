import axios from 'axios';

const fetchValueSets = async ({ type }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/config/valuesets/${type}`);

  return data.expansion;
};

export default fetchValueSets;
