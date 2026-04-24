import { createContext, useMemo } from 'react';
import log from 'xac-loglevel';
import { ontology } from '@/cache/ontology';
import PREDICATE from '@/lib/predicate';

const EditContext = createContext({});

export const EditProvider = ({ children, data }) => {

  const formValue = (data) => JSON.stringify(data)

  const senotypeOntology = useMemo(() => {

    const options = {};
    
    for (const o in ontology) {
      if (PREDICATE.isPredicate(o)) {
        if (options[o] == undefined) {
          options[o] = []
        }
        for (const r of ontology[o].raw) {
          options[o].push({
            value: formValue({
              code: r.valueset_code,
              term: r.valueset_term,
            }),
            label: r.valueset_term,
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
        formValue,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export default EditContext;
