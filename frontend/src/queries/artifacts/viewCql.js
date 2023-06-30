import axios from 'axios';

const viewCql = async ({ artifact, dataModel }) => {
  const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/cql/viewCql`, {
    ...artifact,
    dataModel
  });

  return data;
};

export default viewCql;
