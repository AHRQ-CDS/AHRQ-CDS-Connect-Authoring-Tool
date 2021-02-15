import axios from 'axios';

const fetchConversionFunctions = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/config/conversions`);

  return data;
};

export default fetchConversionFunctions;
