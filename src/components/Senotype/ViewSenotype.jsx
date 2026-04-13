import AppAccordion from '@/components/AppAccordion';
import React, { useEffect, useRef, useState } from 'react';
import { LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Input, Row, Space, Table } from 'antd';
import ClipboardCopy from '@/components/ClipboardCopy';
import AppAnchor from '@/components/AppAnchor';
import URLS from '@/lib/urls';
import { useFetchUBKG } from '@/hooks/useFetchUBKG';

const buildAssertionChildren = (assertions, term) => {
  return assertions
    .filter((item) => item.predicate?.term === term)
    .flatMap((item) => item.objects)
    .map((obj) => ({ key: obj.code, value: obj.term }));
};

const buildSummary = (senotype) => {
  return [
    {
      key: '1',
      label: 'Name',
      children: senotype.senotype.name,
    },
    {
      key: '2',
      label: 'Submitter',
      children: (
        <span className={'flex'}>
          <div>
            {senotype.submitter.name.first} {senotype.submitter.name.last}
          </div>
          <div>
            <a href={`mailto:${senotype.submitter.email}`}>
              {senotype.submitter.email}
            </a>
          </div>
        </span>
      ),
    },
    {
      key: '3',
      label: 'Description',
      children: senotype.senotype.definition,
    },
  ];
};

const buildSenotype = (assertions) => {
  let taxonChildren = buildAssertionChildren(assertions, 'in_taxon');
  let locationChildren = buildAssertionChildren(assertions, 'located_in');
  let celltypeChildren = buildAssertionChildren(assertions, 'has_cell_type');
  let hallmarkChildren = buildAssertionChildren(assertions, 'has_hallmark');
  let microenvironmentChildren = buildAssertionChildren(
    assertions,
    'has_microenvironment',
  );
  let inducerChildren = buildAssertionChildren(assertions, 'has_inducer');
  let assayChildren = buildAssertionChildren(assertions, 'has_assay');
  let diagnosisChildren = buildAssertionChildren(assertions, 'has_diagnosis');

  let keyCounter = 4;
  let items = [
    {
      key: '1',
      label: 'Taxon',
      children: (
        <span className={'flex'}>
          {taxonChildren.map((item, index) => (
            <div key={`taxon_${index}`} className={'mb-1'}>
              {item.value}
            </div>
          ))}
        </span>
      ),
    },
    {
      key: '2',
      label: 'Location',
      children: (
        <span className={'flex'}>
          {locationChildren.map((item, index) => (
            <div key={`location_${index}`} className={'mb-1'}>
              {item.value}&nbsp;
              <img
                src={URLS.organIcon(item.value)}
                className="w-fixed"
                width={16}
                height={16}
                alt={item.value}
              />{' '}
              &nbsp;
              <a
                aria-label={`Outgoing link to ontology for ${item.value}`}
                target={'_blank'}
                href={URLS.getOboDetailsUrl(item.key.replace(':', '_'))}
              >
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    },
    {
      key: '3',
      label: 'Celltype',
      children: (
        <span className={'flex'}>
          {celltypeChildren.map((item, index) => (
            <div key={`celltype_${index}`} className={'mb-1'}>
              {item.key} ({item.value}){' '}
              <a
                target={'_blank'}
                href={URLS.getOboDetailsUrl(item.key.replace(':', '_'))}
              >
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    },
    {
      key: '4',
      label: 'Hallmark',
      children: (
        <span className={'flex'}>
          {hallmarkChildren.map((item, index) => (
            <div key={`hallmark_${index}`} className={'mb-1'}>
              {item.value}
            </div>
          ))}
        </span>
      ),
    },
  ];
  if (microenvironmentChildren.length > 0) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Microenvironment',
      children: (
        <span className={'flex'}>
          {microenvironmentChildren.map((item, index) => (
            <div key={`microenvironment_${index}`} className={'mb-1'}>
              {item.value}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (inducerChildren.length > 0) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Inducer',
      children: (
        <span className={'flex'}>
          {inducerChildren.map((item, index) => (
            <div key={`inducer_${index}`} className={'mb-1'}>
              {item.value}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (assayChildren.length > 0) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Assay',
      children: (
        <span className={'flex'}>
          {assayChildren.map((item, index) => (
            <div key={`assay_${index}`} className={'mb-1'}>
              {item.value}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (diagnosisChildren.length > 0) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Diagnosis',
      children: (
        <span className={'flex'}>
          {diagnosisChildren.map((item, index) => (
            <div key={`diagnosis_${index}`} className={'mb-1'}>
              {item.value}{' '}
              <a
                target={'_blank'}
                href={URLS.getOboDetailsUrl(item.key.replace(':', '_'))}
              >
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    });
  }

  return items;
};

const buildDemographic = (assertions) => {
  let keyCounter = 0;
  let items = [];
  let sexChildren = buildAssertionChildren(assertions, 'has_sex');

  let ageChildren = assertions
    .filter((item) => item.objects[0]?.term === 'age')
    .flatMap((item) => item.objects)
    .map((obj) =>
      obj.lowerbound && obj.upperbound
        ? `${obj.value} ${obj.unit} (range: ${obj.lowerbound}-${obj.upperbound} ${obj.unit})`
        : `${obj.value} ${obj.unit}`,
    );

  let bmiChildren = assertions
    .filter((item) => item.objects[0]?.term === 'bmi')
    .flatMap((item) => item.objects)
    .map((obj) =>
      obj.lowerbound && obj.upperbound
        ? `${obj.value} ${obj.unit} (range: ${obj.lowerbound}-${obj.upperbound} ${obj.unit})`
        : `${obj.value} ${obj.unit}`,
    );

  if (sexChildren.length > 0) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Sex',
      children: (
        <span className={'flex'}>
          {sexChildren.map((item, index) => (
            <div key={`sex_${index}`} className={'mb-1'}>
              {item.value}
            </div>
          ))}
        </span>
      ),
    });
  }
  if (ageChildren.length > 0) {
    keyCounter++;
    items.push({
      key: ageChildren,
      label: 'Age',
      children: (
        <span className={'flex'}>
          {ageChildren.map((item, index) => (
            <div key={`age_${index}`} className={'mb-1'}>
              {item}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (bmiChildren.length > 0) {
    keyCounter++;
    items.push({
      key: bmiChildren,
      label: 'BMI',
      children: (
        <span className={'flex'}>
          {bmiChildren.map((item, index) => (
            <div key={`bmi_${index}`} className={'mb-1'}>
              {item}
            </div>
          ))}
        </span>
      ),
    });
  }

  return items;
};

const buildReferences = (assertions) => {
  let keyCounter = 0;
  let items = [];
  let citationChildren = buildAssertionChildren(assertions, 'has_citation');

  let originChildren = assertions
    .filter((item) => item.predicate?.term === 'has_origin')
    .flatMap((item) => item.objects)
    .map((obj) => ({ key: obj.code, value: `${obj.code} (${obj.term})` }));

  let datasetChildren = assertions
    .filter((item) => item.predicate?.term === 'has_dataset')
    .flatMap((item) => item.objects)
    .map((obj) => ({ key: obj.uuid, value: `${obj.code} (${obj.term})` }));

  if (citationChildren.length > 0) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Citation',
      children: (
        <span className={'flex'}>
          {citationChildren.map((item, index) => (
            <div key={`citation_${index}`} className={'mb-2'}>
              {item.value}{' '}
              <a
                target={'_blank'}
                href={
                  process.env.NEXT_PUBLIC_PUBMED_BASE_URL +
                  item.key.replace('PMID:', '')
                }
              >
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    });
  }

  if (originChildren.length > 0) {
    keyCounter++;
    items.push({
      key: originChildren,
      label: 'Origin',
      children: (
        <span className={'flex'}>
          {originChildren.map((item, index) => (
            <div key={`origin_${index}`} className={'mb-2'}>
              {item.value}{' '}
              <a target={'_blank'} href={URLS.getSciCrunchUrl(item.key)}>
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    });
  }

  if (datasetChildren.length > 0) {
    keyCounter++;
    items.push({
      key: datasetChildren,
      label: 'Dataset',
      children: (
        <span className={'flex'}>
          {datasetChildren.map((item, index) => (
            <div key={`dataset_${index}`} className={'mb-2'}>
              {item.value}{' '}
              <a
                target={'_blank'}
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL}dataset?uuid=${item.key}`}
              >
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    });
  }

  return items;
};

export default function ViewSenotype({ senotype }) {
  const [span, setSpan] = useState(20);
  const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);

  const { data, error, fetchUBKG } = useFetchUBKG();
  const [markerMap, setMarkerMap] = useState({});

  useEffect(() => {
    if (!senotype && senotype?.assertions.length > 0) return;

    const termKeys = [
      'has_characterizing_marker_set',
      'down_regulates',
      'up_regulates',
      'inconclusively_regulates',
    ];

    const codesToFetch = new Set();

    termKeys.forEach((key) => {
      senotype.assertions
        .filter((item) => item.predicate?.term === key)
        .flatMap((item) => item.objects)
        .forEach((obj) => {
          if (obj.code && !markerMap[obj.code]) {
            codesToFetch.add(obj.code);
          }
        });
    });

    console.log(codesToFetch);

    codesToFetch.forEach((code) => {
      fetchUBKG(code).then((result) => {
        setMarkerMap((prev) => {
          if (prev[code]) return prev;
          return { ...prev, [code]: result };
        });
      });
    });
  }, [senotype, fetchUBKG]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  const buildMarkers = (assertions, dataIndex, key, markerType) => {
    return assertions
      .filter((item) => item.predicate?.term === key)
      .flatMap((item) => item.objects)
      .map((obj) =>
        markerType
          ? {
              key: obj.code,
              [dataIndex]: `${markerMap[obj.code] ?? 'loading...'} (${obj.code})`,
              markerType: markerType,
            }
          : {
              key: obj.code,
              [dataIndex]: `${markerMap[obj.code] ?? 'loading...'} (${obj.code})`,
            },
      );
  };

  const markerColumns = (title, dataIndex) => [
    {
      title: title,
      dataIndex: dataIndex,
      key: dataIndex,
      ...getColumnSearchProps(dataIndex),
      sorter: (a, b) => a[dataIndex].localeCompare(b[dataIndex]),
      render: (_, record) => (
        <span>
          {record[dataIndex]}{' '}
          <a target={'_blank'} href={URLS.getMarkerDetailsUrl(record.key)}>
            <LinkOutlined />
          </a>{' '}
        </span>
      ),
    },
  ];

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  return (
    <>
      <Row>
        <Col span={3}>
          <AppAnchor
            items={[
              { key: 'Summary', href: '#summary', title: 'Summary' },
              { key: 'Senotype', href: '#senotype', title: 'Senotype' },
              ...(buildDemographic(senotype.assertions).length > 0
                ? [
                    {
                      key: 'Demographic',
                      href: '#demographic',
                      title: 'Demographic',
                    },
                  ]
                : []),
              ...(buildReferences(senotype.assertions).length > 0
                ? [
                    {
                      key: 'References',
                      href: '#references',
                      title: 'References',
                    },
                  ]
                : []),
              {
                key: 'Specified Markers',
                href: '#specified-markers',
                title: 'Specified Markers',
              },
              {
                key: 'Regulating Markers',
                href: '#regulating-markers',
                title: 'Regulating Markers',
              },
            ]}
            contentId={'view-senotype-col'}
            span={span}
            setSpan={setSpan}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={span} id={'view-senotype-col'}>
          <div className={'markdown'}>
            <h2>
              {senotype.senotype.id}
              <ClipboardCopy
                text={senotype.senotype.id}
                title={'Copy Senotype ID {text} to clipboard'}
              />
            </h2>
            <Button
              href={`${process.env.NEXT_PUBLIC_EDITOR_URL}edit/${senotype.senotype.id}`}
            >
              Edit
            </Button>

            <AppAccordion title={'Summary'} id={'summary'}>
              <Descriptions items={buildSummary(senotype)} column={2} />
            </AppAccordion>

            <AppAccordion title={'Senotype'} id={'senotype'}>
              <Descriptions items={buildSenotype(senotype.assertions)} />
            </AppAccordion>

            {buildDemographic(senotype.assertions).length > 0 && (
              <AppAccordion title={'Demographic'} id={'demographic'}>
                <Descriptions items={buildDemographic(senotype.assertions)} />
              </AppAccordion>
            )}

            {buildReferences(senotype.assertions).length > 0 && (
              <AppAccordion title={'References'} id={'references'}>
                <Descriptions items={buildReferences(senotype.assertions)} />
              </AppAccordion>
            )}

            <AppAccordion title={'Specified Markers'} id={'specified-markers'}>
              <Table
                columns={markerColumns('Specified Marker', 'specified_marker')}
                dataSource={buildMarkers(
                  senotype.assertions,
                  'specified_marker',
                  'has_characterizing_marker_set',
                )}
              ></Table>
            </AppAccordion>

            <AppAccordion
              title={'Regulating Markers'}
              id={'regulating-markers'}
            >
              <Table
                columns={[
                  ...markerColumns('Regulating Marker', 'regulating_marker'),
                  {
                    title: 'Marker Type',
                    key: 'markerType',
                    dataIndex: 'markerType',
                    sorter: (a, b) => a.markerType.localeCompare(b.markerType),
                  },
                ]}
                dataSource={[
                  ...buildMarkers(
                    senotype.assertions,
                    'regulating_marker',
                    'down_regulates',
                    'down',
                  ),
                  ...buildMarkers(
                    senotype.assertions,
                    'regulating_marker',
                    'up_regulates',
                    'up',
                  ),
                  ...buildMarkers(
                    senotype.assertions,
                    'regulating_marker',
                    'inconclusively_regulates',
                    '?',
                  ),
                ]}
                onChange={handleChange}
              ></Table>
            </AppAccordion>
          </div>
        </Col>
      </Row>
    </>
  );
}
