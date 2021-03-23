import axios from 'axios';

const fetchPatients = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/testing`);

  return data;
};

export default fetchPatients;
