import axios from 'axios';

const deletePatient = async ({ patient }) => {
  const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/testing/${patient._id}`);

  return data;
};

export default deletePatient;
