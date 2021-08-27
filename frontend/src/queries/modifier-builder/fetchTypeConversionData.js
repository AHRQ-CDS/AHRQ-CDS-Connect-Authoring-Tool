import axios from 'axios';

const fetchTypeConversionData = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/query/implicitconversion`);

  return data;
};

export default fetchTypeConversionData;
