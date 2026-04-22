import EditContext from '@/context/EditContext';
import React, { useState, useContext, useEffect, useEffectEvent, use } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import AppAccordion from '../AppAccordion';
import InputField from '../form/InputField';
import AppContext from '@/context/AppContext';
import { ubkgPredicates, SEARCH_SENOTYPE } from '@/config/search/senotype';
import { Skeleton } from 'antd';
import log from 'xac-loglevel';
import FormInputGroup from '../form/FormInputGroup';
import useAppReducer from '@/reducers/useAppReducer';
import API from '@/lib/api';
import PREDICATE from '@/lib/predicate'
import SelectField from '../form/SelectField';
import MarkerFormInputs from '../form/MarkerFormInputs';

function SenotypeForm() {
  const [key, setKey] = useState('main');
  const { senotype, senotypeOntologyPromise, senotypePredicates, formValue } =
    useContext(EditContext);
  const { ontology } = useContext(AppContext)
  const senotypeOntology = use(senotypeOntologyPromise);
  const senotypeOntologyReducer = useAppReducer(senotypeOntology || {});
  const getOpenStates = () => {
    return Object.fromEntries(
      Object.entries(senotypeOntology || {}).map(([key, value]) => [
        key,
        false,
      ]),
    );
  }
  const selectAutocompleteReducer = useAppReducer(
    getOpenStates()
  );

  const updateSenotypeOntology = useEffectEvent(() => {
    senotypeOntologyReducer.dispatch({ type: 'setAll', value: senotypeOntology }); 
    selectAutocompleteReducer.dispatch({
      type: 'setAll',
      value: getOpenStates(),
    }); 
  });

  useEffect(() => {
    updateSenotypeOntology()
  }, [senotypeOntology])

  const {
    isAssay,
    isCellType,
    isHallmark,
    isDiagnosis,
    isCitation,
    isOrigin,
    isDataset,
    isExternalSource,
  } = PREDICATE;

  const getOptions = (predicate) => {
    const options = []
    if (predicate.ontologyKey) {
      for (const o in ontology[predicate.ontologyKey].terms) {
        options.push({
          value: formValue({ code: ontology[predicate.ontologyKey].terms[o], term: o}),
          label: o,
        });
      }
    } else if (predicate.field === 'gender') {
      return [
        {
          value: 'male',
          label: 'Male',
        },
        {
          value: 'female',
          label: 'Female',
        },
      ];
    } else {
      return senotypeOntologyReducer?.state[predicate.field] || [];
    }
    return options
  }

  const tab1Predicates = () => {
    const results = Array.from(ubkgPredicates.filter((p) => !isAssay(p.field)));
    for (const a of senotypePredicates) {
      results.push(a);
    }
    results.push({
      field: 'has_diagnosis',
      label: 'Diagnosis',
      ui: {
        tooltip:
          'Enter the exact name for the diagnosis from Disease Ontology (e.g. diabetes) or the diagnosis identifier (e.g., DOID:9351, 9351). Use the search button to go to the Disease Ontology site.',
      },
    });
    return results
  }

  const tab2Predicates = () => {
    const results = [
      {
        field: 'has_citation',
        label: 'Citation',
        ui: {
          tooltip:
            'Enter either a string that is in title of a PubMed article or the PMID (e.g., 41705430, PMID:41705430).',
        },
      },
      {
        field: 'has_origin',
        label: 'Origin',
        ui: {
          tooltip:
            'Enter the RRID of a resource identified in the RRID Portal (e.g., AB_1598149, RRID:AB_1598149).',
        },
      },
      {
        field: 'has_dataset',
        label: 'Dataset',
        ui: {
          tooltip:
            'Use the SenNet ID of a dataset in the Data Portal (e.g, SNT999.ABCD.999).',
        },
      },
    ];
    

    return results;
  };

  const tab2bPredicates = () => {
    const results = [
      {
        field: 'gender',
        label: 'Gender',
        ui: {},
      },
    ];

    return results;
  };

  const fetchForForm = async (predicate, query) => {
    const options = []
    const result = await API.fetch({
      url: `/api/ontology/${predicate.field}`,
      token: null,
      body: {
        query,
      },
    });
    const list = (result?.result && Array.isArray(result?.result)) ? result?.result : [];
    log.info('InputField.fetchForForm', predicate, query, result, list);
    if (isCellType(predicate.field)) {
      for (const r of list) {
        options.push({
          label: r.cell_type.name,
          value: formValue({ term: r.cell_type.name, code: r.cell_type.id }),
        });
      }
    }
    if (isDiagnosis(predicate.field)) {
      for (const r of list) {
        for (const t of r.terms) {
          options.push({
            label: t.term,
            value: formValue({term: t.term, code: r.code})
          })
        }
      }
    }

    if (isCitation(predicate.field)) {
      const _result = result.result?.result || {};
      for (const r in _result) {
        if (_result[r]?.title) {
          options.push({
            label: (
              <span>
                <i>{_result[r].title}</i>&nbsp;
                {_result[r].lastauthor}
              </span>
            ),
            value: formValue({ term: _result[r].title, code: r }),
          });
        }
      }
    }

    if (isOrigin(predicate.field)) {
      const _result = result.result?.hits?.hits || [];
      for (const r of _result) {
        options.push({
          label: `${r._source.item.name}`,
          value: formValue({
            term: r._source.item.name,
            code: r._source.item.curie,
          }),
        });
      }
    }

    if (isDataset(predicate.field)) {
      const _result = result?.result || [];
      for (const r of _result.hits.hits) {
        options.push({
          label: (
            <span>
              <strong>{r._source.sennet_id}</strong>&nbsp;
              <i>{r._source.title}</i>
              {` (${r._source.dataset_type})`}
            </span>
          ),
          value: formValue({
            term: r._source.title,
            code: r._source.sennet_id,
          }),
        });
      }
    }

    if (options.length) {
      senotypeOntologyReducer.dispatch({
        type: 'setOne',
        field: predicate.field,
        value: options,
      });
    }
  }

  const toggleOpen = (field, value) => {
    selectAutocompleteReducer.dispatch({
      type: 'setOne',
      field,
      value
    });
  }

  const getSearchBehavior = (predicate) => {

    if (isExternalSource(predicate.field)) {
      return {
        open: selectAutocompleteReducer?.state[predicate.field],
        onBlur: () => toggleOpen(predicate.field, undefined),
        onSelect: () => toggleOpen(predicate.field, undefined),
        onInputKeyDown: (e) => {
          if (e.key === 'Enter') {
            fetchForForm(predicate, e.currentTarget.value);
            toggleOpen(predicate.field, true);
          }
        },
        showSearch: {
          onSearch: (v) => {},
        },
      };
    } 
    return {}
  }

  const loadingPredicates = !senotypeOntology || !senotypeOntologyReducer.state

  return (
    <>
      <h1 className="h2 mb-5">
        {senotype ? (
          <span>
            Edit <span className="text-muted">{senotype.sennet_id}</span>
          </span>
        ) : (
          'New'
        )}
      </h1>
      <Tabs
        id="senotypeForm--Tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="main" title="Submission">
          <AppAccordion title={'Overview'}>
            <InputField
              label={'Name'}
              controlProps={{
                defaultValue: senotype?.title,
                required: true,
              }}
            />
            <InputField
              label={'Description'}
              controlProps={{
                required: true,
                defaultValue: senotype?.definition,
                as: 'textarea',
                rows: 3,
              }}
            />
          </AppAccordion>
          <AppAccordion title={'Senotype'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <>
                {tab1Predicates().map((p, index) => (
                  <SelectField
                    key={index}
                    p={p}
                    getOptions={getOptions}
                    getSearchBehavior={getSearchBehavior}
                    senotype={senotype}
                  />
                ))}
              </>
            )}
          </AppAccordion>
        </Tab>
        <Tab eventKey="citationDemographics" title="Citation & Demographics">
          <AppAccordion title={'Citation & Origin'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <>
                {tab2Predicates().map((p, index) => (
                  <SelectField
                    key={index}
                    p={p}
                    getOptions={getOptions}
                    getSearchBehavior={getSearchBehavior}
                    senotype={senotype}
                  />
                ))}
              </>
            )}
          </AppAccordion>
          <AppAccordion title={'Demographics'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <>
                {tab2bPredicates().map((p, index) => (
                  <SelectField
                    key={index}
                    p={p}
                    getOptions={getOptions}
                    getSearchBehavior={getSearchBehavior}
                    senotype={senotype}
                  />
                ))}
              </>
            )}
            <FormInputGroup
              label={'Age'}
              inputs={[
                {
                  label: 'Value',
                  controlProps: {
                    type: 'number',
                    min: 0,
                  },
                },
                {
                  label: 'Lower',
                  controlProps: {
                    type: 'number',
                    min: 0,
                  },
                },
                {
                  label: 'Upper',
                  controlProps: {
                    type: 'number',
                    min: 0,
                  },
                },
                {
                  label: 'Unit',
                  controlProps: {
                    value: 'year',
                    disabled: true,
                  },
                },
              ]}
            />

            <FormInputGroup
              label={'BMI'}
              inputs={[
                {
                  label: 'Value',
                  controlProps: {
                    type: 'number',
                    min: 0,
                  },
                },
                {
                  label: 'Lower',
                  controlProps: {
                    type: 'number',
                    min: 0,
                  },
                },
                {
                  label: 'Upper',
                  controlProps: {
                    type: 'number',
                    min: 0,
                  },
                },
                {
                  label: 'Unit',
                  controlProps: {
                    value: 'kg/m2',
                    disabled: true,
                  },
                },
              ]}
            />
          </AppAccordion>
        </Tab>
        <Tab eventKey="markers" title="Markers">
          <AppAccordion title={'Specified Marker'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <MarkerFormInputs
                predicate={{
                  field: 'has_characterizing_marker_set',
                  label: 'Gene/Protein ID or Symbol',
                  ui: {
                    tooltip:
                      'For genes, enter HGNC ID, symbol, alias, or past symbol; for proteins, enter UniprotKB ID or symbol.',
                  },
                }}
                getOptions={getOptions}
                getSearchBehavior={getSearchBehavior}
                senotype={senotype}
              />
            )}
          </AppAccordion>

          <AppAccordion title={'Regulating Marker'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <MarkerFormInputs
                predicate={{
                  field: 'up_regulates',
                  label: 'Gene/Protein ID or Symbol',
                  fields: [
                    'up_regulates',
                    'down_regulates',
                    'inconclusively_regulates',
                  ],
                  ui: {
                    tooltip:
                      'For genes, enter HGNC ID, symbol, alias, or past symbol; for proteins, enter UniprotKB ID or symbol.',
                  },
                }}
                getOptions={getOptions}
                getSearchBehavior={getSearchBehavior}
                senotype={senotype}
              />
            )}
          </AppAccordion>
        </Tab>
      </Tabs>
      <div className="c-senotypeForm__fotter mt-4 text-end">
        <Button>Submit</Button>
      </div>
    </>
  );
}

export default SenotypeForm;
