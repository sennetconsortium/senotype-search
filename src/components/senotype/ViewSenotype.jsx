import AppAccordion from '@/components/AppAccordion';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Container, Row } from 'react-bootstrap';
import { Button, Descriptions, Input, Space, Table } from 'antd';
import ClipboardCopy from '@/components/ClipboardCopy';
import AppAnchor from '@/components/AppAnchor';
import URLS from '@/lib/urls';
import ResultsExport from '@/components/search/ResultsExport';
import PREDICATE from '@/lib/predicate';
import ViewSenotypeHeader from '@/components/senotype/ViewSenotypeHeader';

const buildSummary = (senotype) => {
  return [
    {
      key: '1',
      label: 'Title',
      children: senotype.title,
    },
    {
      key: '2',
      label: 'Submitter',
      children: (
        <span className={'flex'}>
          <div>{senotype.created_by_user_displayname}</div>
          <div>
            <a href={`mailto:${senotype.created_by_user_email}`}>
              {senotype.created_by_user_email}{' '}
              <i className="bi bi-envelope"></i>
            </a>
          </div>
        </span>
      ),
    },
    {
      key: '3',
      label: 'Description',
      children: senotype.description,
    },
  ];
};

const buildSenotype = (senotype) => {
  let keyCounter = 4;
  let items = [
    {
      key: '1',
      label: 'Hallmark',
      children: (
        <span className={'flex'}>
          {senotype['hallmark'].map((item, index) => (
            <div key={`hallmark_${index}`} className={'mb-1'}>
              {item.term}
            </div>
          ))}
        </span>
      ),
    },
    {
      key: '2',
      label: 'Taxon',
      children: (
        <span className={'flex'}>
          {senotype['taxon'].map((item, index) => (
            <div key={`taxon_${index}`} className={'mb-1'}>
              {item.term}
            </div>
          ))}
        </span>
      ),
    },
    {
      key: '3',
      label: 'Organ',
      children: (
        <span className={'flex'}>
          {senotype['organ'].map((item, index) => (
            <div key={`organ_${index}`} className={'mb-1'}>
              {item.term}&nbsp;
              <img
                src={URLS.organIcon(item.term)}
                className="w-fixed"
                width={16}
                height={16}
                alt={item.code}
              />{' '}
              &nbsp;
              <a
                aria-label={`Outgoing link to ontology for ${item.code}`}
                target={'_blank'}
                href={`${URLS.portal}organs/${item.term?.toDashedCase()}`}
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
      label: 'Celltype',
      children: (
        <span className={'flex'}>
          {senotype['cell_type'].map((item, index) => (
            <div key={`celltype_${index}`} className={'mb-1'}>
              {item.term} ({item.code}){' '}
              <a
                target={'_blank'}
                href={URLS.getOboDetailsUrl(item.code.replace(':', '_'))}
              >
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    },
  ];
  if (senotype?.microenvironment) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Microenvironment',
      children: (
        <span className={'flex'}>
          {senotype['microenvironment'].map((item, index) => (
            <div key={`microenvironment_${index}`} className={'mb-1'}>
              {item.term}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (senotype?.inducer) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Inducer',
      children: (
        <span className={'flex'}>
          {senotype['inducer'].map((item, index) => (
            <div key={`inducer_${index}`} className={'mb-1'}>
              {item.term}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (senotype?.assay) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Assay',
      children: (
        <span className={'flex'}>
          {senotype['assay'].map((item, index) => (
            <div key={`assay_${index}`} className={'mb-1'}>
              {item.term}
            </div>
          ))}
        </span>
      ),
    });
  }

  if (senotype?.diagnosis) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Diagnosis',
      children: (
        <span className={'flex'}>
          {senotype['diagnosis'].map((item, index) => (
            <div key={`diagnosis_${index}`} className={'mb-1'}>
              {item.term}{' '}
              <a
                target={'_blank'}
                href={URLS.getOboDetailsUrl(item.code.replace(':', '_'))}
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

const buildDemographic = (senotype) => {
  let keyCounter = 0;
  let items = [];

  if (senotype?.sex) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Sex',
      children: (
        <span className={'flex'}>
          {senotype['sex'].map((item, index) => (
            <div key={`sex_${index}`} className={'mb-1'}>
              {item.term}
            </div>
          ))}
        </span>
      ),
    });
  }
  if (senotype?.age) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Age',
      children: (
        <span className={'flex'}>
          {senotype.age.lowerbound && senotype.age.upperbound
            ? `${senotype.age.value} ${senotype.age.unit} (range: ${senotype.age.lowerbound}-${senotype.age.upperbound} ${senotype.age.unit})`
            : `${senotype.age.value} ${senotype.age.unit}`}
        </span>
      ),
    });
  }

  if (senotype?.bmi) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'BMI',
      children: (
        <span className={'flex'}>
          {senotype.bmi.lowerbound && senotype.bmi.upperbound
            ? `${senotype.bmi.value} ${senotype.bmi.unit} (range: ${senotype.bmi.lowerbound}-${senotype.bmi.upperbound} ${senotype.bmi.unit})`
            : `${senotype.bmi.value} ${senotype.bmi.unit}`}
        </span>
      ),
    });
  }

  return items;
};

const buildReferences = (senotype) => {
  let keyCounter = 0;
  let items = [];

  if (senotype?.citation) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Citation',
      children: (
        <span className={'flex'}>
          {senotype['citation'].map((item, index) => (
            <div key={`citation_${index}`} className={'mb-2'}>
              {item.term}{' '}
              <a
                target={'_blank'}
                href={
                  process.env.NEXT_PUBLIC_PUBMED_BASE_URL +
                  item.code.replace('PMID:', '')
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

  if (senotype?.origin) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Origin',
      children: (
        <span className={'flex'}>
          {senotype['origin'].map((item, index) => (
            <div key={`origin_${index}`} className={'mb-2'}>
              {item.term}{' '}
              <a target={'_blank'} href={URLS.getSciCrunchUrl(item.code)}>
                <LinkOutlined />
              </a>
            </div>
          ))}
        </span>
      ),
    });
  }

  if (senotype?.dataset) {
    keyCounter++;
    items.push({
      key: keyCounter,
      label: 'Dataset',
      children: (
        <span className={'flex'}>
          {senotype['dataset'].map((item, index) => (
            <div key={`dataset_${index}`} className={'mb-2'}>
              {item.title}{' '}
              <a
                target={'_blank'}
                href={`${URLS.portal}dataset?uuid=${item.uuid}`}
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
  const [span, setSpan] = useState(10);
  const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);

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

  const buildMarkers = useCallback((markerSet, dataIndex, markerType) => {
    if (markerSet) {
      return markerSet.map((obj) =>
        markerType
          ? {
              key: obj.code,
              [dataIndex]: `${obj.name ? obj.name : obj.term} (${obj.code})`,
              markerType,
            }
          : {
              key: obj.code,
              [dataIndex]: `${obj.name ? obj.name : obj.term} (${obj.code})`,
            },
      );
    } else {
      return [];
    }
  }, []);

  const getColumnSearchProps = useCallback(
    (title, dataIndex) => ({
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
            placeholder={`Search ${title}`}
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
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
    }),
    [],
  );

  const specifiedMarkerData = useMemo(
    () =>
      buildMarkers(
        senotype?.specified_marker_set,
        'specified_marker',
        null,
      ),
    [senotype, buildMarkers],
  );

  const regulatingMarkerData = useMemo(
    () => [
      ...buildMarkers(senotype['down_regulates'], 'regulating_marker', 'down'),
      ...buildMarkers(senotype['up_regulates'], 'regulating_marker', 'up'),
      ...buildMarkers(
        senotype['inconclusively_regulates'],
        'regulating_marker',
        '?',
      ),
    ],
    [senotype, buildMarkers],
  );

  const markerColumns = useCallback(
    (title, dataIndex) => [
      {
        title: title,
        dataIndex: dataIndex,
        key: dataIndex,
        ...getColumnSearchProps(title, dataIndex),
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
    ],
    [getColumnSearchProps],
  );

  const tableFooter = (total, range, data) => {
    return (
      <ResultsExport
        data={PREDICATE.markersExportData(data)}
        columns={PREDICATE.markersExportColumns()}
      >
        <span className="mx-4">{`${range[0]}-${range[1]} of ${total} items`}</span>
      </ResultsExport>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={2}>
          <AppAnchor
            items={[
              { key: 'Summary', href: '#summary', title: 'Summary' },
              { key: 'Senotype', href: '#senotype', title: 'Senotype' },
              ...(buildDemographic(senotype).length > 0
                ? [
                    {
                      key: 'Demographic',
                      href: '#demographic',
                      title: 'Demographic',
                    },
                  ]
                : []),
              ...(buildReferences(senotype).length > 0
                ? [
                    {
                      key: 'References',
                      href: '#references',
                      title: 'References',
                    },
                  ]
                : []),
              ...(specifiedMarkerData.length > 0
                ? [
                    {
                      key: 'Specified Markers',
                      href: '#specified-markers',
                      title: 'Specified Markers',
                    },
                  ]
                : []),
              ...(regulatingMarkerData.length > 0
                ? [
                    {
                      key: 'Regulating Markers',
                      href: '#regulating-markers',
                      title: 'Regulating Markers',
                    },
                  ]
                : []),
            ]}
            contentId={'view-senotype-col'}
            span={span}
            setSpan={setSpan}
          />
        </Col>

        <Col lg={span} id={'view-senotype-col'}>
          <div className={'markdown'}>
            <h2>
              {senotype.sennet_id}
              <ClipboardCopy
                text={senotype.sennet_id}
                title={'Copy Senotype ID {text} to clipboard'}
              />
            </h2>

            <ViewSenotypeHeader data={senotype} />

            <AppAccordion title={'Summary'} id={'summary'}>
              <Descriptions items={buildSummary(senotype)} column={2} />
            </AppAccordion>

            <AppAccordion
              title={'Senotype'}
              id={'senotype'}
              tooltipTitle={'Senotype title'}
            >
              <Descriptions items={buildSenotype(senotype)} column={3} />
            </AppAccordion>

            {buildDemographic(senotype).length > 0 && (
              <AppAccordion title={'Demographic'} id={'demographic'}>
                <Descriptions items={buildDemographic(senotype)} />
              </AppAccordion>
            )}

            {buildReferences(senotype).length > 0 && (
              <AppAccordion title={'References'} id={'references'}>
                <Descriptions items={buildReferences(senotype)} column={1} />
              </AppAccordion>
            )}

            {specifiedMarkerData.length > 0 && (
              <AppAccordion
                title={'Specified Markers'}
                id={'specified-markers'}
                tooltipTitle={
                  'These gene or protein markers are a list an investigator might recommend be used to describe the markers that would help identify or characterize a senescent cell of this senotype–e.g., to use as a gene panel for a probed assay.'
                }
              >
                <Table
                  pagination={{
                    total: specifiedMarkerData.length,
                    showTotal: (total, range) =>
                      tableFooter(total, range, specifiedMarkerData),
                  }}
                  columns={markerColumns(
                    'Specified Marker',
                    'specified_marker',
                  )}
                  dataSource={specifiedMarkerData}
                ></Table>
              </AppAccordion>
            )}

            {regulatingMarkerData.length > 0 && (
              <AppAccordion
                title={'Regulated Markers'}
                id={'regulating-markers'}
                tooltipTitle={
                  'These are typically a longer list of gene or protein markers that have been tested for the senotype. The investigator observes these markers to be up-regulated; down-regulated; or tested but inconclusive whether up- or down- regulated (e.g., using log2FC and p-value).'
                }
              >
                <Table
                  pagination={{
                    total: regulatingMarkerData.length,
                    showTotal: (total, range) =>
                      tableFooter(total, range, regulatingMarkerData),
                  }}
                  columns={[
                    ...markerColumns('Regulated Marker', 'regulating_marker'),
                    {
                      title: 'Marker Type',
                      key: 'markerType',
                      dataIndex: 'markerType',
                      sorter: (a, b) =>
                        a.markerType.localeCompare(b.markerType),
                    },
                  ]}
                  dataSource={regulatingMarkerData}
                  onChange={handleChange}
                ></Table>
              </AppAccordion>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
