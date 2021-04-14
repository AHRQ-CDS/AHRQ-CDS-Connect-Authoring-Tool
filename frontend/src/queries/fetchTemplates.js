import axios from 'axios';

const fetchTemplates = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/config/templates`);

  return data;
};

export default fetchTemplates;
