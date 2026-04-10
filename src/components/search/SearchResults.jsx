import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { useSearchUIContext } from 'search-ui/components/core/SearchUIContext';
import ClipboardCopy from '../ClipboardCopy';
import ModalOverComponent from '../ModalOverComponent';
import SearchResultsMeta from './SearchResultsMeta';
import log from 'xac-loglevel';
import { assertionPredicates } from '@/config/search/senotype';
import '@/lib/general';
import { ontology } from '@/cache/ontology';
import Icon from '@ant-design/icons';
import URLS from '@/lib/urls';

function SearchResults() {
  const [tableData, setTableData] = useState([]);

  const {
    wasSearched,
    filters,
    setPageNumber,
    rawResponse,
    pageSize,
    setPageSize,
  } = useSearchUIContext();
  const [_pageSize, _setPageSize] = useState(pageSize);

  const columns = [
    {
      title: 'SenNet ID',
      dataIndex: 'senotype.id',
      key: 'senotype.id',
      width: 250,
      sorter: (a, b) => a.senotype.id.localeCompare(b.senotype.id),
      render: (_, record) => (
        <>
          <a href={`/senotype/${record.senotype.id}`}>{record.senotype.id}</a>
          <ClipboardCopy
            text={record.senotype.id}
            title={'Copy SenNet ID {text} to clipboard'}
          />
        </>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'senotype.name',
      key: 'senotype.name',
      width: 350,
      sorter: (a, b) => a.senotype.name.localeCompare(b.senotype.name),
      render: (_, record) => {
        return (
          <div>
            {record.senotype.name}
            <br />
            <ModalOverComponent
              modalContent={record.senotype.definition}
              tag="small"
              maxLength={100}
            >
              <small>{record.senotype.definition.substr(0, 100)}</small>
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
        OrganIcon = () => (
          <img height={16} width={16} src={URLS.organIcon(o)} />
        );
        list.push(
          <a key={o} href={`${URLS.portal}organs/${o?.toLowerCase()}`}>
            <Button icon={<Icon component={OrganIcon} />} iconPlacement="end">
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
    for (const a of filtered) {
      for (const [i, c] of a.objects.entries()) {
        list.push(
          <span key={c.code}>
            <a
              href={`${URLS.obo}${c.code.replaceAll(':', '_')}`}
              className="text-black"
            >
              {c.term} <i className="bi bi-link-45deg text-primary"></i>
            </a>
            {i < a.objects.length - 1 ? ',' : ''}{' '}
          </span>,
        );
      }
    }

    return <div>{list}</div>;
  };
  const getColumns = () => {
    const assertionsWithIndividualColumns = assertionPredicates.map((a) => a.v);
    const allAssertions = Array.from(assertionPredicates);
    allAssertions.push({
      name: 'Other Assertions',
      k: 'other',
      v: '',
      ui: { w: 300 },
    });
    const getTerms = (p, record) => {
      const filtered =
        p.k === 'other'
          ? record.assertions.filter(
              (r) =>
                assertionsWithIndividualColumns.indexOf(r.predicate.term) ===
                -1,
            )
          : record.assertions.filter((r) => r.predicate.term === p.v);
      const terms = filtered.map((a) => a.objects?.map((o) => o.term));
      const content = terms.join(', ');
      return { filtered, terms, content };
    };
    for (const p of allAssertions) {
      columns.push({
        title: p.name || p.k.replaceAll('_', ' ').titleCase(),
        dataIndex: `assertions.predicate.term.${p.k}`,
        key: `assertions.predicate.term.${p.k}`,
        sorter: (a, b) => {
          const termsA = getTerms(p, a);
          const termsB = getTerms(p, b);
          return termsA.content.localeCompare(termsB.content);
        },
        width: p.ui.w,
        render: (_, record) => {
          const { filtered, terms, content } = getTerms(p, record);

          if (p.k === 'organ') {
            return organIconRender(terms);
          }
          if (p.k === 'cell_type') {
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

  useEffect(() => {
    setTableData(rawResponse?.records?.senotypes);
    log.debug('SearchResults.useEffect', rawResponse);
  }, [rawResponse]);

  useEffect(() => {
    setPageSize(_pageSize);
  }, [_pageSize]);

  const handleTableChange = (pagination, filters, sorter) => {
    log.debug('SearchResults.handleTableChange', pagination);
    setPageNumber(pagination.current);
    _setPageSize(pagination.pageSize);
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

  return (
    <div>
      <SearchResultsMeta />
      <Table
        columns={getColumns()}
        dataSource={tableData}
        rowKey={'id'}
        onChange={handleTableChange}
        scroll={{ x: 1500, y: 1500 }}
        pagination={{
          total: rawResponse?.info?.senotypes?.total_result_count,
          pageSize: pageSize,
          showSizeChanger: pageSizeOptions.length > 0,
          pageSizeOptions,
        }}
      />
    </div>
  );
}

export default SearchResults;
