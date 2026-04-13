import { useEffect, useState } from 'react';
import API from '@/lib/api';

export function useSenotype(senotype_id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!senotype_id) return;

    API.fetchSenotype(senotype_id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [senotype_id]);

  return { data, loading, error };
}
