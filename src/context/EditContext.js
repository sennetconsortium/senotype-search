import API from '@/lib/api';
import ENVS from '@/lib/envs';
import { createContext, useMemo } from 'react';
import log from 'xac-loglevel';

const EditContext = createContext({});

export const EditProvider = ({ children, data }) => {

  const formValue = ({code, term}) => JSON.stringify({code, term})

  const senotypePredicates = [
    {
      field: 'has_assay',
      label: 'Assay',
      ui: {},
    },
    {
      field: 'has_hallmark',
      label: 'Hallmark',
      ui: { required: true },
    },
    {
      field: 'has_inducer',
      label: 'Inducer',
      ui: {},
    },
    {
      field: 'has_microenvironment',
      label: 'Microenvironment',
      ui: {},
    },
  ];

  const senotypeOntologyPromise = useMemo(async () => {
    const results = {};
    const options = {};
    let query;
    for (const p of senotypePredicates) {
      query = {
        size: 0,
        aggs: {
          ontology: {
            terms: {
              field: `${p.field}.term.keyword`,
              size: 1000,
            },
            aggs: {
              detail: {
                top_hits: {
                  size: 1,
                  _source: {
                    includes: [`${p.field}.code`],
                  },
                },
              },
            },
          },
        },
      };
      results[p.field] = await API.search(query, ENVS.index.senotype);
      options[p.field] = []
    }
    log.debug('EditProvider.useMemo.senotypeLibOntology', results);
    
    for (const r in results) {
      for (const b of results[r].aggregations.ontology?.buckets) {
        options[r].push({
          value: formValue({
            code: b.details?.hits?.hits[0]._source[r][0].code,
            term: b.key
          }),
          label: b.key,
        });
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
        senotypeOntologyPromise,
        senotypePredicates,
        formValue,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export default EditContext;
