import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import { useSearchUIContext } from "search-ui/components/core/SearchUIContext";
import ClipboardCopy from '../ClipboardCopy';
import ModalOverComponent from '../ModalOverComponent';

function SearchResults() {
  const [tableData, setTableData] = useState([])
  const { wasSearched, filters, rawResponse } = useSearchUIContext()

  const columns = [
    {
      title: 'SenNet ID',
      dataIndex: 'senotype.id',
      key: 'senotype.id',
      width: 250,
      render: (_, record) => <a href={`/senotype/${record.senotype.id}`}>{record.senotype.id}<ClipboardCopy text={record.senotype.id} title={'Copy SenNet ID {text} to clipboard'} /></a>,
    },
    {
      title: 'Title',
      dataIndex: 'senotype.name',
      key: 'senotype.name',
      width: 350,
      render: (_, record) => {
        return <div>{record.senotype.name}<br />
          <ModalOverComponent modalContent={record.senotype.definition} maxLength={100}>
            <small>{record.senotype.definition.substr(0, 100)}</small>
          </ModalOverComponent>
          
        </div>
      },
    },
    {
      title: 'Assertions',
      dataIndex: 'assertions.objects.term',
      key: 'assertions.objects.term',
      render: (_, record) => {
        const terms = record.assertions.map((a) => a.objects?.map((o) => o.term))
        const content = terms.join(', ')
        return <div><ModalOverComponent maxLength={100} modalContent={content}>
            {content.substr(0, 100)}
          </ModalOverComponent></div>
      },
    }
  ]
  useEffect(() => {
    setTableData(rawResponse?.records?.senotypes)
    console.log('SEARCH', rawResponse)
  }, [rawResponse])
  return (
    <div>
      <Table columns={columns} dataSource={tableData} rowKey={'id'} />
    </div>
  )
}

export default SearchResults