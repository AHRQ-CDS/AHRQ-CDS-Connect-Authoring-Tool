import axios from 'axios';

const fetchUnitsOfMeasure = async ({ terms }) => {
  const { data } = await axios.get(`https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search`, {
    params: { terms }
  });

  if (!data[3]) return [];

  return data[3].map(([code, desc]) => ({
    value: code,
    label: `${code} (${desc})`
  }));
};

export default fetchUnitsOfMeasure;
