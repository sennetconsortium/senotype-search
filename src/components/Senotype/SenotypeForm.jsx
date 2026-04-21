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
import useSenotypeOntology from '@/reducers/useSenotypeOntology';

function SenotypeForm() {
  const [key, setKey] = useState('main');
  const { senotype, senotypeOntologyPromise, senotypePredicates, formValue } =
    useContext(EditContext);
  const { ontology } = useContext(AppContext)
  const senotypeOntology = use(senotypeOntologyPromise);
  const senotypeOntologyReducer = useSenotypeOntology(senotypeOntology || {});

  const updateSenotypeOntology = useEffectEvent(() => {
    senotypeOntologyReducer.dispatch({ type: 'setAll', value: senotypeOntology }); 
  });

  useEffect(() => {
    updateSenotypeOntology()
  }, [senotypeOntology])

  const isAssay = (p) => p === 'has_assay';
  const isCellType = (p) => p === 'has_cell_type';
  const isHallmark = (p) => p === 'has_hallmark';
  const isDiagnosis = (p) => p === 'has_diagnosis';

  const getOptions = (predicate) => {
    const options = []
    if (predicate.ontologyKey) {
      // TODO find source data for taxon
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
      if (isHallmark(a.field) || isAssay(a.field)) {
        results.push(a);
      }
    }
    return results
  }

  const tab2Predicates = () => {
    const results = [
      {
        field: 'has_diagnosis',
        label: 'Diagnosis',
        ui: {
          tooltip:
            'Enter the exact name for the diagnosis from Disease Ontology (e.g. diabetes) or the diagnosis identifier (e.g., DOID:9351, 9351). Use the search button to go to the Disease Ontology site.',
        },
      },
    ];
    for (const a of senotypePredicates) {
      if (!isHallmark(a.field) || !isAssay(a.field)) {
        results.push(a);
      }
    }
    results.push({
      field: 'gender',
      label: 'Gender',
      ui: {},
    });
    return results;
  };

  const fetchForForm = async (predicate, query) => {
    const options = []
    const result = await fetch(`/api/ontology/${predicate.field}`, {
      method: 'POST',
      body: JSON.stringify({
        query
      })
    });
    log.info('InputField.fetchForForm', predicate, query, result);
    if (isCellType(predicate.field)) {
      setCellTypeOptions([])
    }
    if (isDiagnosis(predicate.field)) {
      for (const r of result.result) {
        for (const t of r.terms) {
          options.push({
            label: t.term,
            value: formValue({term: t.term, code: r.code})
          })
        }
      }
      if (options.length) {
        setDiagnosisOptions(options)
      }
    }
  }


  const getSearchBehavior = (predicate) => {
    // TODO: resolve search behavior for cell types
    // resolve for Diagnosis
    if (isCellType(predicate.field) || isDiagnosis(predicate.field)) {
      return {
        showSearch: {
          filterOption: false,
          onSearch: (v) => {
            fetchForForm(predicate, v);
          },
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
                  <InputField
                    key={p.field}
                    labelTooltip={p.ui.tooltip}
                    label={
                      p.label ||
                      SEARCH_SENOTYPE.searchQuery.facets[p.field]?.label
                    }
                    id={p.field}
                    selectData={getOptions(p)}
                    controlProps={{
                      ...getSearchBehavior(p),
                      defaultValue: senotype[p.field]
                        ? senotype[p.field][0]?.term
                        : undefined,
                      required: p.ui.required,
                    }}
                  />
                ))}
              </>
            )}
          </AppAccordion>
        </Tab>
        <Tab eventKey="metadata" title="Metadata">
          <AppAccordion title={'Diagnosis & Demographics'}>
            {loadingPredicates && <Skeleton />}
            {!loadingPredicates && (
              <>
                {tab2Predicates().map((p, index) => (
                  <InputField
                    key={p.field}
                    labelTooltip={p.ui.tooltip}
                    label={p.label}
                    id={p.field}
                    selectData={getOptions(p)}
                    controlProps={{
                      ...getSearchBehavior(p),
                      defaultValue: senotype[p.field]
                        ? senotype[p.field][0]?.term
                        : undefined,
                      required: p.ui.required,
                    }}
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
                    min: 0
                  },
                },
                {
                  label: 'Lower',
                  controlProps: {
                    type: 'number',
                    min: 0
                  },
                },
                {
                  label: 'Upper',
                  controlProps: {
                    type: 'number',
                    min: 0
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
                    min: 0
                  },
                },
                {
                  label: 'Lower',
                  controlProps: {
                    type: 'number',
                    min: 0
                  },
                },
                {
                  label: 'Upper',
                  controlProps: {
                    type: 'number',
                    min: 0
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
          Tab content for Markers
        </Tab>
      </Tabs>
      <div className="c-senotypeForm__fotter mt-4 text-end">
        <Button>Submit</Button>
      </div>
    </>
  );
}

export default SenotypeForm;
