import React, { useMemo } from 'react';
import { Button, Table } from 'antd';
import { useSearchUIContext } from 'search-ui/components/core/SearchUIContext';
import ClipboardCopy from '../ClipboardCopy';
import ModalOverComponent from '../ModalOverComponent';
import SearchResultsMeta from './SearchResultsMeta';
import log from 'xac-loglevel';
import { assertionPredicates, SEARCH_SENOTYPE } from '@/config/search/senotype';
import { ontology } from '@/cache/ontology';
import Icon from '@ant-design/icons';
import URLS from '@/lib/urls';
import { Col, Row } from 'react-bootstrap';
import ResultsExport from './ResultsExport';
import Image from 'next/image';

function SearchResults() {
  const {
    wasSearched,
    filters,
    setPageNumber,
    rawResponse,
    pageSize,
    setPageSize,
  } = useSearchUIContext();

  const tableData = useMemo(
    () => rawResponse?.records?.senotypes ?? [],
    [rawResponse],
  );

  const isLoading = rawResponse == null;

  const columns = [
    {
      title: 'SenNet ID',
      dataIndex: 'sennet_id',
      key: 'sennet_id',
      width: 250,
      sorter: (a, b) => a.sennet_id.localeCompare(b.sennet_id),
      render: (_, record) => (
        <>
          <a href={`/senotype/${record.sennet_id}`}>{record.sennet_id}</a>
          <ClipboardCopy
            text={record.sennet_id}
            title={'Copy SenNet ID {text} to clipboard'}
          />
        </>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 350,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (_, record) => {
        return (
          <div>
            {record.title}
            <br />
            <ModalOverComponent
              modalContent={record.definition}
              tag="small"
              maxLength={100}
            >
              <small>{record.definition.substr(0, 100)}</small>
            </ModalOverComponent>
          </div>
        );
      },
    },
  ];

  const organIconRender = (terms) => {
    let organs = new Set();
    for (const o of terms) {
      organs.add(ontology.organ_types.hierarchy[o]);
    }
    organs = Array.from(organs);
    const list = [];

    let OrganIcon;
    for (const o of organs) {
      if (o) {
        list.push(
          <a key={o} href={`${URLS.portal}organs/${o?.toDashedCase()}`}>
            <Button
            className='mb-2'
              icon={
                <Icon
                  component={() => (
                    <Image
                      height={16}
                      width={16}
                      src={URLS.organIcon(o)}
                      alt={o}
                    />
                  )}
                />
              }
              iconPlacement="end"
            >
              {o}
            </Button>
          </a>,
        );
      }
    }
    return <div>{list}</div>;
  };

  const cellTypesRender = (filtered) => {
    const list = [];
    for (const [i, c] of filtered.entries()) {
      list.push(
        <span key={c.code}>
          <a
            href={`${URLS.obo}${c.code.replaceAll(':', '_')}`}
            className="text-black"
          >
            {c.term} <i className="bi bi-link-45deg text-primary"></i>
          </a>
          {i < filtered.length - 1 ? ',' : ''}{' '}
        </span>,
      );
    }

    return <div>{list}</div>;
  };
  const getColumns = () => {
    const allAssertions = Array.from(assertionPredicates);
    allAssertions.push({
      name: 'Other Assertions',
      alias: 'other',
      field: ['has_hallmark', 'inconclusively_regulates'],
      ui: { w: 300 },
    });
    const getTerms = (p, record) => {
      let filtered = []
      if (Array.isArray(p.field)) {
        for (const f of p.field) {
          filtered = filtered.concat(record[f] || [])
        }
      } else {
        filtered = record[p.field] || [];
      }
      
      const terms = filtered.map((a) => a.term);
      const content = terms.join(', ');
      return { filtered, terms, content };
    };
    for (const p of allAssertions) {
      columns.push({
        title: p.name || SEARCH_SENOTYPE.searchQuery.facets[p.field]?.label,
        dataIndex: `${p.field}`,
        key: `${p.field}`,
        sorter: (a, b) => {
          const termsA = getTerms(p, a);
          const termsB = getTerms(p, b);
          return termsA.content.localeCompare(termsB.content);
        },
        width: p.ui.w,
        render: (_, record) => {
          const { filtered, terms, content } = getTerms(p, record);

          if (p.alias === 'organ') {
            return organIconRender(terms);
          }
          if (p.alias === 'cell_type') {
            return cellTypesRender(filtered);
          } else {
            return (
              <div>
                <ModalOverComponent maxLength={100} modalContent={content}>
                  <p style={{ wordBreak: 'break-all' }}>
                    {content.substr(0, 100)}
                  </p>
                </ModalOverComponent>
              </div>
            );
          }
        },
      });
    }
    return columns;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    log.debug('SearchResults.handleTableChange', pagination);
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const getPageSizeOptions = () => {
    const total = rawResponse?.info?.senotypes?.total_result_count;
    let num = 0;
    const ops = [];
    for (let i = 1; i <= 10; i += 2) {
      num = num + i * 10;
      if (num < total) {
        ops.push(num);
      }
    }
    if (20 < total) {
      ops.splice(1, 0, 20);
    }
    return ops;
  };

  const pageSizeOptions = getPageSizeOptions();
  const totalRows = rawResponse?.info?.senotypes?.total_result_count;
  return (
    <div className="c-searchResults">
      <div className="c-searchResults__headerTools mb-3">
        <Row>
          <Col>
            <SearchResultsMeta />
          </Col>
          <Col className="d-flex flex-row-reverse">
            <ResultsExport />
          </Col>
        </Row>
      </div>
      <Table
        loading={isLoading}
        columns={getColumns()}
        dataSource={tableData}
        rowKey={'id'}
        onChange={handleTableChange}
        scroll={{ x: 1500, y: 1500 }}
        pagination={{
          total: totalRows,
          pageSize: pageSize,
          showSizeChanger: pageSizeOptions.length > 0,
          pageSizeOptions,
        }}
      />
    </div>
  );
}

export default SearchResults;
