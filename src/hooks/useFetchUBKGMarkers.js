import { useCallback, useRef, useState } from 'react';
import API from '@/lib/api';
import { loadCache, saveCache } from '@/lib/localStorage';
import log from 'xac-loglevel';

export function useFetchUBKGMarkers() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const STORAGE_KEY = 'ubkg-markers-cache';

  // Caches utilize useRef so they are mutable and stable across renders
  const ubkgCacheRef = useRef(loadCache(STORAGE_KEY));
  const ubkgInFlightRef = useRef(new Map());

  // Utilizing useCallback to prevent creating this function on every render
  const fetchUBKGMarkers = useCallback((code, defaultValue) => {
    if (!code || !code.includes(':')) {
      return Promise.resolve(null);
    }

    const ubkgCache = ubkgCacheRef.current;
    const ubkgInFlight = ubkgInFlightRef.current;

    if (ubkgCache.has(code)) {
      log.debug('Cache found code: ', code);
      const cached = ubkgCache.get(code);
      setData(cached);
      return Promise.resolve(cached);
    }

    if (ubkgInFlight.has(code)) {
      return ubkgInFlight.get(code);
    }

    const [markerType, markerId] = code.split(':');
    const marker = markerType === 'HGNC' ? 'genes' : 'proteins';

    const endpoint = `${marker}/${markerId}`;

    const request = API.fetchUBKG(endpoint)
      .then((result) => {
        if (!result) {
          ubkgInFlight.delete(code);
          setError('Failed to fetch UBKG marker for ' + code);
          console.error('Failed to fetch UBKG marker for ' + code);
          return defaultValue;
        }
        let name = '';
        if (markerType === 'HGNC') {
          name = result[0]['approved_name'];
        } else {
          name = result[0]['recommended_name'];
        }
        ubkgCache.set(code, name);
        saveCache(STORAGE_KEY, ubkgCache);
        ubkgInFlight.delete(code);
        setData(name);
        return name;
      })
      .catch((err) => {
        ubkgInFlight.delete(code);
        setError(err.message);
        throw err;
      });

    ubkgInFlight.set(code, request);
    return request;
  }, []);

  return { data, error, fetchUBKGMarkers };
}
