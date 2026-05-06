import { createContext, useMemo } from 'react';
import log from 'xac-loglevel';
import ontology from '@/cache/ontology.json' with { type: 'json' };
import PREDICATE from '@/lib/predicate';

const EditContext = createContext({});

export const EditProvider = ({ children, data }) => {

  const formatValue = (data) => JSON.stringify(data);

  const formatErrorRow = ({row, error}) => {
    return {
      row,
      error,
      _id: crypto.randomUUID()
    }
  }

  const senotypeOntology = useMemo(() => {

    const options = {};
    
    for (const o in ontology) {
      if (PREDICATE.isPredicate(o)) {
        if (options[o] == undefined) {
          options[o] = []
        }
        for (const r of ontology[o].raw) {
          options[o].push({
            value: formatValue({
              code: r.code,
              term: r.term,
            }),
            label: r.term,
          });
        }
      }
    }
    return options;
  }, []);

  
  const senotype = useMemo(
    () => {
      log.debug('EditProvider.useMemo.senotype', data);
      return data
    },
    [data],
  );

  return (
    <EditContext.Provider
      value={{
        senotype,
        senotypeOntology,
        formatValue,
        formatErrorRow,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export default EditContext;
