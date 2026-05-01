import EditContext from '@/context/EditContext';
import React, { useState, useContext, useEffect, useEffectEvent, useRef } from 'react';
import { Tab, Tabs, Form, Button } from 'react-bootstrap';
import AppAccordion from '@/components/AppAccordion';
import InputField from '@/components/form/InputField';
import AppContext from '@/context/AppContext';
import { ubkgPredicates } from '@/config/search/senotype';
import { Skeleton, App, Table } from 'antd';
import log from 'xac-loglevel';
import FormInputGroup from '@/components/form/FormInputGroup';
import useAppReducer from '@/reducers/useAppReducer';
import API from '@/lib/api';
import PREDICATE from '@/lib/predicate'
import SelectField from '@/components/form/SelectField';
import MarkerFormInputs from '@/components/form/MarkerFormInputs';
import URLS from '@/lib/urls';
import HeaderBadges from '@/components/senotype/HeaderBadges';
import ClipboardCopy from '@/components/ClipboardCopy';
import AppSpinner from '@/components/AppSpinner';
import { Divider } from 'antd';
import THEME from '@/lib/theme';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

function SenotypeForm({isEdit = false}) {
  const { notification } = App.useApp();
  const [key, setKey] = useState('main');
  const { senotype, senotypeOntology, formatValue } = useContext(EditContext);
  const { ontology, auth } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const senotypeOntologyReducer = useAppReducer(senotypeOntology);
  const getOpenStates = () => {
    return Object.fromEntries(
      Object.entries(senotypeOntology).map(([key, value]) => [
        key,
        false,
      ]),
    );
  }
  const selectVisibleDropdownReducer = useAppReducer(
    getOpenStates()
  );

  const selectBusyReducer = useAppReducer(getOpenStates());
  const formValuesReducer = useAppReducer(senotype || {})

  const updateSenotypeOntology = useEffectEvent(() => {
    const _ontology = {...senotypeOntology}
    for (const o of tabPredicates()) {
      _ontology[o.field] = _ontology[o.field] || []
    }
    senotypeOntologyReducer.dispatch({ value: _ontology }); 

    selectVisibleDropdownReducer.dispatch({
      value: getOpenStates(),
    }); 
    selectBusyReducer.dispatch({
      value: getOpenStates(),
    }); 
  });

  const updateSenotypeValues = useEffectEvent(() => {
    formValuesReducer.dispatch({ value: senotype });
  });

  useEffect(() => {
    updateSenotypeOntology()
  }, [senotypeOntology])

  useEffect(() => {
    if (senotype) {
      log.debug('SenotypeForm > senotype', senotype)
      updateSenotypeValues();
    }
  }, [senotype]);

  const {
    isAssay,
    isCellType,
    isDiagnosis,
    isCitation,
    isOrigin,
    isDataset,
    isExternalSource,
    isSpecifiedMarker,
    isRegulatedMarker,
  } = PREDICATE;

  const getOptions = (predicate) => {
    const options = []
    if (predicate.ontologyKey) {
      for (const o in ontology[predicate.ontologyKey].terms) {
        options.push({
          value: formatValue({ code: ontology[predicate.ontologyKey].terms[o], term: o}),
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
        field: 'assay',
        label: 'Assay',
        ui: {},
      },
      {
        field: 'inducer',
        label: 'Inducer',
        ui: {},
      },
      {
        field: 'microenvironment',
        label: 'Microenvironment',
        ui: {},
      },
    ];
    results.push({
      field: 'diagnosis',
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
        field: 'citation',
        label: 'Citation',
        ui: {
          tooltip:
            'Enter either a string that is in title of a PubMed article or the PMID (e.g., 41705430, PMID:41705430).',
        },
      },
      {
        field: 'origin',
        label: 'Origin',
        ui: {
          tooltip:
            'Enter the RRID of a resource identified in the RRID Portal (e.g., AB_1598149, RRID:AB_1598149).',
        },
      },
      {
        field: 'dataset',
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
        field: 'sex',
        label: 'Sex',
        ui: {},
      },
    ];

    return results;
  };

  const handleMarkers = ({predicate, _query, data, regulatingAction, options}) => {
    if (isSpecifiedMarker(predicate.field) || isRegulatedMarker(predicate.field)) {
      const _result = Array.isArray(data.result) ? data.result : [];
      let action = regulatingAction || undefined;
      if (isRegulatedMarker(predicate.field) && !action) {
        action = formValuesReducer.state.action || PREDICATE.regulatedActions.up_regulates;
      }
      for (const r of _result) {
        if (_query.includes(PREDICATE.prefixIds.gene)) {
          options.push({
            label: r.approved_name,
            value: formatValue({
              action,
              name: r.approved_name,
              term: r.approved_symbol,
              code: `${_query.split(':')[0]}:${r.hgnc_id}`,
            }),
          });
        } else {
          options.push({
            label: r.recommended_name[0],
            value: formatValue({
              action,
              term: r.recommended_name[0],
              code: `${_query.split(':')[0]}:${r.uniprotkb_id}`,
            }),
          });
        }
      }
    }

    return options
  }

  const fetchVocabulary = async (predicate, query) => {
    toggleBusy(predicate.field, true);
    let _query = query
    // Prefix for marker with selected radio or default
    if (isSpecifiedMarker(predicate.field) || isRegulatedMarker(predicate.field)) {
      const prefix = isRegulatedMarker(predicate.field)
        ? 'marker_type_regulated'
        : 'marker_type';
      _query = query.includes(':') ? query.split(':')[1] : query
      _query = `${formValuesReducer.state[prefix] || PREDICATE.prefixIds.gene}${_query}`;
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
    log.info('InputField.fetchVocabulary', predicate, query, data, list);
    if (isCellType(predicate.field)) {
      for (const r of list) {
        options.push({
          label: r.cell_type.name,
          value: formatValue({ term: r.cell_type.name, code: r.cell_type.id }),
        });
      }
    }
    if (isDiagnosis(predicate.field)) {
      for (const r of list) {
        for (const t of r.terms) {
          options.push({
            label: t.term,
            value: formatValue({ term: t.term, code: r.code }),
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
            value: formatValue({ term: _result[r].title, code: r }),
          });
        }
      }
    }

    if (isOrigin(predicate.field)) {
      const _result = data.result?.hits?.hits || [];
      for (const r of _result) {
        options.push({
          label: `${r._source.item.name}`,
          value: formatValue({
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
          value: formatValue({
            term: r._source.title,
            code: r._source.sennet_id,
          }),
        });
      }
    }

    handleMarkers({predicate, options, data, _query, query});

    if (options.length) {
      senotypeOntologyReducer.dispatch({
        field: predicate.field,
        value: options,
      });
    }
    toggleBusy(predicate.field, false);
  };

  const toggleOpen = (field, value) => {
    selectVisibleDropdownReducer.dispatch({
      field,
      value
    });
  }

  const toggleBusy = (field, value) => {
    selectBusyReducer.dispatch({
      field,
      value,
    });
  }

  const getSearchBehavior = (predicate) => {

    if (isExternalSource(predicate.field)) {
      return {
        open: selectVisibleDropdownReducer?.state[predicate.field],
        onBlur: () => toggleOpen(predicate.field, undefined),
        onSelect: () => {
          toggleOpen(predicate.field, undefined);
        },
        onInputKeyDown: (e) => {
          if (e.key === 'Enter') {
            fetchVocabulary(predicate, e.currentTarget.value);
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
    let value = data.value
    log.info('SenotypeForm.onChange', data.field, value);
    formValuesReducer.dispatch({field: data.field, value});
  }

  const tabPredicates = () =>
    tab1Predicates().concat(tab2Predicates()).concat(tab2bPredicates());

  const formatRequestBody = () => {
    const body = {};
    for (const f in formValuesReducer.state) {
      if (isRegulatedMarker(f)) {
        body[f] = formValuesReducer.state[f].map((t) => ({
          action: t.action,
          marker: t.code || t.marker?.code,
        }));
      } else {
        if (!Array.isArray(formValuesReducer.state[f]) || isDiagnosis(f)) {
          body[f] = formValuesReducer.state[f];
        } else {
          body[f] = formValuesReducer.state[f].map((t) => t.code || t.uuid);
        }
      }
    }
    return body
  }

  const submissionNotification = (res) => {
    const verb = isEdit ? 'Edited': 'Created';
    let icon = (
      <CheckCircleFilled style={{ color: '#198754', fontSize: '22px' }} />
    );
    let description;
    if (res.error) {
      icon = <CloseCircleFilled style={{ color: '#dc3545', fontSize: '22px' }} />;
      if (res.description.errors) {
        const errorData = Object.entries(res.description.errors).map(
          (value, i) => {
            return {
              field: value[0],
              error: Array.isArray(value[1])
                ? value[1].join(', ')
                : value[1].toString(),
            };
          },
        );
        const errorColumns = ['field', 'error'].map((n) => ({
          title: n,
          dataIndex: n,
          key: n,
        }));
        description = (
          <>
            <p>There were errors in your request.</p>
            <Table
              dataSource={errorData}
              columns={errorColumns}
              rowKey={'field'}
            />
          </>
        );
      } else {
        description = <>{res.description.message}</>;
      }
      setIsBusy(false);
    } else {
     
      description = (
        <>
          <p>Your Senotype has been {verb.toLowerCase()}.</p>
          <p>
            <strong>SenNet ID: </strong>
            {res?.sennet_id}
            <ClipboardCopy
              text={res?.sennet_id}
              title={'Copy Senotype ID {text} to clipboard'}
            />{' '}
          </p>

          <div>
            <HeaderBadges data={formValuesReducer.state} />
          </div>
          <Divider />
          <div className={THEME.classNames.rightAlign}>
            <a className="btn btn-outline-primary rounded-0" href="/search">
              Search Senotypes
            </a>
            <a
              className="btn btn-outline-secondary mx-2 rounded-0"
              href={`/senotype/${res.uuid}`}
            >
              View Senotype
            </a>
          </div>
        </>
      );
      setIsBusy(isEdit ? false : null); 
    }

    // TODO update notification details
    const title = (
      <span>
        {icon} <span className="mx-2">{res.error || `Senotype ${verb}`}</span>
      </span>
    );
    notification.destroy();
    notification.open({
      className: 'ant-notification--middle',
      duration: false,
      title,
      description,
      placement: 'top',
    });
  }

  const postPut = () => {
    const url = URLS.api.local('senotype');
    const method = isEdit ? 'PUT': 'POST';

    // Format the request body according to expected API structure
    const body = formatRequestBody()

    API.fetch({ url, body, method }).then((res) => {
      submissionNotification(res.description || res.senotype)
    });

    log.debug(
      'SenotypeForm.handleSubmit > formValuesReducer',
      formValuesReducer,
    );
  }

  const toggleErrorStyles = (required) => {
    required.map((p) => {
      document
        .querySelectorAll(`#c-inputField--${p.field} .ant-select`)
        .forEach((el) => {
          THEME.getTabPaneTab(el).classList.add(THEME.classNames.invalid);
          el.classList.add(THEME.classNames.invalid);
        });
    });
  }

  const handleSubmit = (e) => {
    try {
      const form = e.currentTarget;
      setIsBusy(true);

      e.preventDefault();
      e.stopPropagation();

      const required = tabPredicates().filter(
        (f) =>
          f.ui?.required === true &&
          ((formValuesReducer.state &&
            formValuesReducer.state[f.field] === undefined) ||
            !formValuesReducer.state),
      );

      const validationFailed = form.checkValidity() === false || required.length > 0;
      if (validationFailed) {
        toggleErrorStyles(required)
        setIsBusy(false);
      } else {
        postPut();
      }
      setValidated(true);
      
    } catch (errorInfo) {
      log.error(
        'SenotypeForm.handleSubmit > Manual validation failed:',
        errorInfo,
      );
    }
  }

  const loadingPredicates = !senotypeOntology || !senotypeOntologyReducer.state || !selectBusyReducer.state || (isEdit && !formValuesReducer.state)

  return (
    <>
      <Form
        className="c-senotypeForm"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        layout="vertical"
      >
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
                label={'Title'}
                id={'title'}
                onChange={onChange}
                controlProps={{
                  defaultValue: senotype?.title,
                  required: true,
                }}
              />
              <InputField
                label={'Description'}
                id={'description'}
                onChange={onChange}
                controlProps={{
                  required: true,
                  defaultValue: senotype?.description,
                  as: 'textarea',
                  rows: 3,
                }}
              />
            </AppAccordion>
            <AppAccordion title={'Senotype'}>
              {loadingPredicates && <Skeleton.Input block={true} />}
              {!loadingPredicates && (
                <>
                  {tab1Predicates().map((p, index) => (
                    <SelectField
                      key={index}
                      p={p}
                      getOptions={getOptions}
                      getSearchBehavior={getSearchBehavior}
                      reducer={formValuesReducer}
                      onChange={onChange}
                      isBusy={selectBusyReducer.state[p.field]}
                    />
                  ))}
                </>
              )}
            </AppAccordion>
          </Tab>
          <Tab eventKey="citationDemographics" title="Citation & Demographics">
            <AppAccordion title={'Citation & Origin'}>
              {loadingPredicates && <Skeleton.Input block={true} />}
              {!loadingPredicates && (
                <>
                  {tab2Predicates().map((p, index) => (
                    <SelectField
                      key={index}
                      p={p}
                      getOptions={getOptions}
                      getSearchBehavior={getSearchBehavior}
                      reducer={formValuesReducer}
                      onChange={onChange}
                      isBusy={selectBusyReducer.state[p.field]}
                    />
                  ))}
                </>
              )}
            </AppAccordion>
            <AppAccordion title={'Demographics'}>
              {loadingPredicates && <Skeleton.Input block={true} />}
              {!loadingPredicates && (
                <>
                  {tab2bPredicates().map((p, index) => (
                    <SelectField
                      key={index}
                      p={p}
                      getOptions={getOptions}
                      getSearchBehavior={getSearchBehavior}
                      reducer={formValuesReducer}
                      onChange={onChange}
                    />
                  ))}
                </>
              )}
              <FormInputGroup
                label={'Age'}
                id={'age'}
                onChange={onChange}
                inputs={[
                  {
                    label: 'Value',
                    id: 'value',
                    formatter: Number,
                    controlProps: {
                      type: 'number',
                      min: 0,
                    },
                  },
                  {
                    label: 'Lower',
                    id: 'lowerbound',
                    formatter: Number,
                    controlProps: {
                      type: 'number',
                      min: 0,
                    },
                  },
                  {
                    label: 'Upper',
                    id: 'upperbound',
                    formatter: Number,
                    controlProps: {
                      type: 'number',
                      min: 0,
                    },
                  },
                  {
                    label: 'Unit',
                    id: 'unit',
                    controlProps: {
                      value: 'year',
                      disabled: true,
                    },
                  },
                ]}
              />

              <FormInputGroup
                label={'BMI'}
                id={'bmi'}
                onChange={onChange}
                inputs={[
                  {
                    label: 'Value',
                    id: 'value',
                    formatter: Number,
                    controlProps: {
                      type: 'number',
                      min: 0,
                    },
                  },
                  {
                    label: 'Lower',
                    id: 'lowerbound',
                    formatter: Number,
                    controlProps: {
                      type: 'number',
                      min: 0,
                    },
                  },
                  {
                    label: 'Upper',
                    id: 'upperbound',
                    formatter: Number,
                    controlProps: {
                      type: 'number',
                      min: 0,
                    },
                  },
                  {
                    label: 'Unit',
                    id: 'unit',
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
                    field: 'specified_marker_set',
                    label: 'Gene/Protein ID or Symbol',
                    ui: {
                      tooltip:
                        'For genes, enter HGNC ID, symbol, alias, or past symbol; for proteins, enter UniprotKB ID or symbol.',
                    },
                  }}
                  busy={{ toggleBusy, selectBusyReducer }}
                  handleMarkers={handleMarkers}
                  getOptions={getOptions}
                  getSearchBehavior={getSearchBehavior}
                  reducer={formValuesReducer}
                  onChange={onChange}
                />
              )}
            </AppAccordion>

            <AppAccordion title={'Regulated Marker'}>
              {loadingPredicates && <Skeleton />}
              {!loadingPredicates && (
                <MarkerFormInputs
                  predicate={{
                    field: 'regulated_marker_set',
                    label: 'Gene/Protein ID or Symbol',
                    fields: Object.keys(PREDICATE.regulatedActions),
                    ui: {
                      tooltip:
                        'For genes, enter HGNC ID, symbol, alias, or past symbol; for proteins, enter UniprotKB ID or symbol.',
                    },
                  }}
                  busy={{ toggleBusy, selectBusyReducer }}
                  handleMarkers={handleMarkers}
                  getOptions={getOptions}
                  getSearchBehavior={getSearchBehavior}
                  reducer={formValuesReducer}
                  onChange={onChange}
                />
              )}
            </AppAccordion>
          </Tab>
        </Tabs>
        <div className="c-senotypeForm__fotter mt-4 text-end">
          <Button
            disabled={isBusy !== false || (isEdit && !auth.isSameUser(senotype?.created_by_user_sub))}
            type="submit"
          >
            Submit
          </Button>
          <AppSpinner otherProps={{ spinning: isBusy }} />
        </div>
      </Form>
    </>
  );
}

export default SenotypeForm;
