import { useState } from 'react';
import API from '@/lib/api';

export function useFetchUBKG() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUBKG = (code) => {
    if (!code || !code.includes(':')) {
      return Promise.resolve(null);
    }

    const [markerType, markerId] = code.split(':');
    const marker = markerType === 'HGNC' ? 'genes' : 'proteins';

    const endpoint = `${marker}/${markerId}`;
    console.log("Fetching UBKG...")

    return API.fetchUBKG(endpoint)
      .then((result) => {
        let name = '';
        if (markerType === 'HGNC') {
          name = result[0]['approved_name'];
        } else {
          name = result[0]['recommended_name'];
        }
        setData(name);
        return name;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  };

  return { data, error, fetchUBKG };
}
