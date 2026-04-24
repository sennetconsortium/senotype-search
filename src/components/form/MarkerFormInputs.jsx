import { useState, useRef } from 'react';
import { Flex, Radio, message, Upload, Table } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import { Form } from 'react-bootstrap';
import log from 'xac-loglevel'
import SelectField from './SelectField';
import PREDICATE from '@/lib/predicate';
import { Tooltip } from 'antd';

function MarkerFormInputs({
  predicate,
  getOptions,
  getSearchBehavior,
  senotype,
  onChange,
}) {

  const [tableData, setTableData] = useState([])
  const isValidFile = useRef(null)

  const removeItem = (row) => {
    const _tableData = tableData.filter((r) => row.code !== r.code)
    setTableData(_tableData)
  }
  const getTableColumns = () => {
    const names = ['name', 'term', 'code', ...(predicate.fields ? ['regulating_action'] : [])]
    const columns = []
    for (const n of names) {
      columns.push({
        title: n,
        dataIndex: n,
        key: n,
      });
    }

    columns.push({
      title: 'Delete',
      dataIndex: '',
      key: 'delete',
      render: (row) => (
        <div className='text-danger mx-3'>
          <i onClick={() => removeItem(row)} role='button' aria-label={`Trash ${row.code}`} className="bi bi-trash">&nbsp;</i>
        </div>
      ),
    });
    return columns;
  }

  const onChangeDataFile = (file) => {
    if (file && isValidFile.current) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContents = e.target.result;
        log.debug('MarkerFormInputs.onChangeDataFile', fileContents.csvToJson());
      };

      reader.onerror = (e) => {
        log.error('MarkerForm.onChangeDataFile', e);
      };

      reader.readAsText(file);
    }
  };
  const uploadProps = {
    name: 'file',
    beforeUpload: (file) => {
      const isLt4 = file.size / 1024 / 1024 < 4; ;
      const extension = file.name.split('.').pop();
      isValidFile.current = isLt4 && extension.eq('csv');
      return false;
    },
    onChange(info) {
      onChangeDataFile(info.file);
    },
    onDrop(e) {
      onChangeDataFile(e.dataTransfer.files[0]);
    },
  };

  const handleRadioChange = (data) => {
    log.debug('MarkerFormInputs.handleRadioChange', data);
    onChange({field: data.target.name, e: data})
  }

  const handleOnChange = (data) => {
    const _tableData = [...tableData]
    const added = new Set(_tableData.map((t) => t.code))
    const newItem = JSON.parse(data.e)
    if (!added.has(newItem.code)) {
      _tableData.push(newItem);
    }
    setTableData(_tableData)
    onChange({...data, value: JSON.stringify(_tableData)})
    log.debug('MarkerFormInputs.handleOnChange', data, _tableData);
  }

  const _getSearchBehavior = (predicate) => {
    const res = getSearchBehavior(predicate)
    const onSelect = res.onSelect;
    res.onSelect = (v) => {
      handleOnChange({e: v})
      onSelect()
    }
    return res
  }

  return (
    <div className="c-markerForm">
      <Flex vertical gap={0}>
        <Form.Label htmlFor={'marker-type'}>
          <strong>Marker type</strong>
        </Form.Label>
        <Radio.Group
          onChange={handleRadioChange}
          defaultValue={PREDICATE.prefixIds.genes}
          buttonStyle="solid"
          id="marker-type"
          name={`marker_type${predicate.fields ? '_regulating' : ''}`}
        >
          <Radio.Button value={PREDICATE.prefixIds.genes}>Gene</Radio.Button>
          <Radio.Button value={PREDICATE.prefixIds.proteins}>
            Protein
          </Radio.Button>
        </Radio.Group>
        {predicate.fields && (
          <div className="mt-4">
            <Form.Label htmlFor={'action'}>
              <strong>Action</strong>
            </Form.Label>
            <div>
              <Radio.Group
                onChange={handleRadioChange}
                defaultValue={predicate.fields[0]}
                buttonStyle="solid"
                id="action"
                name="regulating_action"
              >
                {predicate.fields.map((p, index) => (
                  <Radio.Button key={`radio-${index}`} value={p}>
                    {p}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        )}
        {tableData.length > 0 && (
          <div className="mt-3">
            <Table
              columns={getTableColumns()}
              dataSource={tableData}
              rowKey={'code'}
            />
          </div>
        )}
        <SelectField
          p={predicate}
          getOptions={getOptions}
          getSearchBehavior={_getSearchBehavior}
          senotype={senotype}
          useSearchIcon={true}
          mode={'single'}
        />
      </Flex>

      <div className="mt-4">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag a CSV file with <code>type</code>, <code>id</code>,
            and <code>action</code> columns. file to this area to upload.
          </p>
          <p className="ant-upload-hint">
            Download an <a href="/bulk/markers-example.csv">example file csv</a>
            .{' '}
            <Tooltip
              color={'lightgrey'}
              styles={{ root: { maxWidth: '500px' } }}
              title={
                <ul className="list-group">
                  <li className="list-group-item">
                    <code>type</code> must be <code>gene</code> or{' '}
                    <code>protein</code>.
                  </li>
                  <li className="list-group-item">
                    A <code>gene</code> id must correspond to a HGNC symbol.
                    Example: <code>BRCA1</code>
                  </li>
                  <li className="list-group-item">
                    A <code>protein</code> id must correspond to a UniProtKB ID.
                    Example: <code>Q13201</code>
                  </li>
                  {predicate.fields && <li className="list-group-item">
                    The <code>action</code> must be one of the following:
                    <ul>
                      <li>
                        <code>1</code> for upregulation
                      </li>
                      <li>
                        <code>-1</code> for downregulation
                      </li>
                      <li>
                        <code>0</code> for inconclusive regulation
                      </li>
                    </ul>
                  </li>}
                </ul>
              }
            >
              <i className="bi bi-question-circle"></i>
            </Tooltip>
          </p>
        </Dragger>
      </div>
    </div>
  );
}

export default MarkerFormInputs;
