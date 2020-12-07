import { useQuery } from 'react-query';
import axios from 'axios';

export default function useUcum(terms) {
  return useQuery(['ucum', terms], async () => {
    if (!terms) return [];

    const { data } = await axios.get(`https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search`, {
      params: { terms }
    });

    if (!data[3]) return [];

    return data[3].map(([code, desc]) => ({
      value: code,
      label: `${code} (${desc})`
    }));
  });
}
