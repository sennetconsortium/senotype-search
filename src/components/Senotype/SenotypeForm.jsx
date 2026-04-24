import EditContext from '@/context/EditContext';
import React, { useState, useContext, useEffect, useEffectEvent, useRef } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import AppAccordion from '../AppAccordion';
import InputField from '../form/InputField';
import AppContext from '@/context/AppContext';
import { ubkgPredicates } from '@/config/search/senotype';
import { Skeleton } from 'antd';
import log from 'xac-loglevel';
import FormInputGroup from '../form/FormInputGroup';
import useAppReducer from '@/reducers/useAppReducer';
import API from '@/lib/api';
import PREDICATE from '@/lib/predicate'
import SelectField from '../form/SelectField';
import MarkerFormInputs from '../form/MarkerFormInputs';
import URLS from '@/lib/urls';

function SenotypeForm() {
  const [key, setKey] = useState('main');
  const { senotype, senotypeOntology, formValue } = useContext(EditContext);
  const { ontology } = useContext(AppContext)
  const form = useRef(senotype)

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

  useEffect(() => {
    form.current = senotype
  }, [senotype]);

  const {
    isAssay,
    isCellType,
    isHallmark,
    isDiagnosis,
    isCitation,
    isOrigin,
    isDataset,
    isExternalSource,
    isMarker,
    isRegulatingMarker,
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
    } else {
      return senotypeOntologyReducer?.state[predicate.field] || [];
    }
    return options
  }

  const tab1Predicates = () => {
    const results = [
      ...ubkgPredicates.filter((p) => !isAssay(p.field)),
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
        field: 'has_sex',
        label: 'Sex',
        ui: {},
      },
    ];

    return results;
  };

  const handleMarkers = ({predicate, _query, data, regulatingAction, options}) => {
    if (isMarker(predicate.field) || isRegulatingMarker(predicate.field)) {
      const _result = Array.isArray(data.result) ? data.result : [];
      let regulating_action = regulatingAction || undefined;
      if (isRegulatingMarker(predicate.field) && !regulating_action) {
        regulating_action = form.current.regulating_action || PREDICATE.regulatingActions.up_regulates;
      }
      for (const r of _result) {
        if (_query.includes(PREDICATE.prefixIds.genes)) {
          options.push({
            label: r.approved_name,
            value: formValue({
              regulating_action,
              name: r.approved_name,
              term: r.approved_symbol,
              code: `${_query.split(':')[0]}:${r.hgnc_id}`,
            }),
          });
        } else {
          options.push({
            label: r.recommended_name[0],
            value: formValue({
              regulating_action,
              term: r.recommended_name[0],
              code: `${_query.split(':')[0]}:${r.uniprotkb_id}`,
            }),
          });
        }
      }
    }

    return options
  }

  const fetchForForm = async (predicate, query) => {
    let _query = query
    // Prefix for marker with selected radio or default
    if (isMarker(predicate.field) || isRegulatingMarker(predicate.field)) {
      const prefix = isRegulatingMarker(predicate.field)
        ? 'marker_type_regulating'
        : 'marker_type';
      _query = `${form.current[prefix] || PREDICATE.prefixIds.genes}${query}`;
    }
    const options = [];
    const data = await API.fetch({
      url: URLS.api.local(`ontology/${predicate.field}`),
      token: null,
      body: {
        query: _query,
      },
    });
    const list =
      data?.result && Array.isArray(data?.result) ? data?.result : [];
    log.info('InputField.fetchForForm', predicate, query, data, list);
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
            value: formValue({ term: t.term, code: r.code }),
          });
        }
      }
    }

    if (isCitation(predicate.field)) {
      const _result = data.result?.result || {};
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
      const _result = data.result?.hits?.hits || [];
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
      const _result = data?.result || [];
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

    handleMarkers({predicate, options, data, _query, query});

    if (options.length) {
      senotypeOntologyReducer.dispatch({
        type: 'setOne',
        field: predicate.field,
        value: options,
      });
    }
  };

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
        onSelect: () => {
          toggleOpen(predicate.field, undefined);
        },
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

  const onChange = (data) => {
    let value = data.value || data.e.target?.value;
    log.info('SenotypeForm.onChange', data.field, value);
    form.current = { ...form.current, [data.field]: value };
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    log.info('SenotypeForm.handleSubmit', form)
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
              id={'name'}
              onChange={onChange}
              controlProps={{
                defaultValue: senotype?.title,
                required: true,
              }}
            />
            <InputField
              label={'Description'}
              id={'definition'}
              onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
                  />
                ))}
              </>
            )}
            <FormInputGroup
              label={'Age'}
              field={'age'}
              onChange={onChange}
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
              field={'bmi'}
              onChange={onChange}
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
                handleMarkers={handleMarkers}
                getOptions={getOptions}
                getSearchBehavior={getSearchBehavior}
                senotype={senotype}
                onChange={onChange}
              />
            )}
          </AppAccordion>

          <AppAccordion title={'Regulating Marker'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <MarkerFormInputs
                predicate={{
                  field: 'has_characterizing_regulating_marker_set',
                  label: 'Gene/Protein ID or Symbol',
                  fields: Object.keys(PREDICATE.regulatingActions),
                  ui: {
                    tooltip:
                      'For genes, enter HGNC ID, symbol, alias, or past symbol; for proteins, enter UniprotKB ID or symbol.',
                  },
                }}
                handleMarkers={handleMarkers}
                getOptions={getOptions}
                getSearchBehavior={getSearchBehavior}
                senotype={senotype}
                onChange={onChange}
              />
            )}
          </AppAccordion>
        </Tab>
      </Tabs>
      <div className="c-senotypeForm__fotter mt-4 text-end">
        <Button onClick={(e) => handleSubmit(e)}>Submit</Button>
      </div>
    </>
  );
}

export default SenotypeForm;
