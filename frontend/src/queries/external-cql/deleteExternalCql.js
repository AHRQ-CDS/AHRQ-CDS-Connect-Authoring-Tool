import axios from 'axios';

const deleteExternalCql = async ({ library }) => {
  const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/externalCQL/${library._id}`);

  return data;
};

export default deleteExternalCql;
