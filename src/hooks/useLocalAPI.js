import { useEffect, useMemo, useRef, useState } from 'react';
import log from 'xac-loglevel';

function useLocalAPI({ path = 'senotype', query, values }) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const fetchData = async () => {
    const res = await fetch(`/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        values,
      }),
    });
    if (res.ok) {
      setResults(await res.json());
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return { results, loading };
}

export default useLocalAPI;
