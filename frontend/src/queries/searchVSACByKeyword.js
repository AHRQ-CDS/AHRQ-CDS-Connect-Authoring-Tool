import axios from 'axios';

const searchVSACByKeyword = async ({ keyword, apiKey }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fhir/search?keyword=${keyword}`, {
    auth: { username: '', password: apiKey }
  });

  return {
    count: data.count,
    results: data.results.sort((a, b) => b.codeCount - a.codeCount)
  };
};

export default searchVSACByKeyword;
