import axios from 'axios';

const addExternalCql = async library => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/externalCQL`, { library });
    if (/^Unable to upload/.test(data)) return Promise.reject({ statusText: data, cqlErrors: null });
    return data;
  } catch (error) {
    const statusText = typeof error.response?.data === 'string' ? error.response.data : '';
    return Promise.reject({
      statusText,
      cqlErrors: typeof error.response?.data === 'object' ? error.response.data : null
    });
  }
};

export default addExternalCql;
