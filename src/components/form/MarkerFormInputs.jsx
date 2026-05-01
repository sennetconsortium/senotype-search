import { useState, useRef, useContext, useEffect, useEffectEvent } from 'react';
import { Flex, Radio, message, Upload, Table } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import { Form } from 'react-bootstrap';
import log from 'xac-loglevel'
import SelectField from './SelectField';
import PREDICATE from '@/lib/predicate';
import { Tooltip } from 'antd';
import { flipObj } from '@/lib/general';
import API from '@/lib/api';
import URLS from '@/lib/urls';
import AppSpinner from '../AppSpinner';
import EditContext from '@/context/EditContext';

function MarkerFormInputs({
  predicate,
  getOptions,
  getSearchBehavior,
  reducer,
  onChange,
  handleMarkers,
  busy,
}) {
  const [tableData, setTableData] = useState([]);
  const isValidFile = useRef(null);
  const uploadRows = useRef([]);
  const hasInit = useRef(false)
  const [tableBusy, setTableBusy] = useState(false);
  const tableErrors = useRef([])
  const { formatErrorRow } = useContext(EditContext);

  const updateTable= useEffectEvent(() => {
    const data = reducer.state[predicate.field] || []
    const list = []
    let marker 
    for (const d of data) {
      marker = d.marker || {...d}
      let { key, _id } = getTableId({ ...marker, action: d.action });
      list.push({ _id, key, ...marker, action: d.action });
    }
    hasInit.current = true;
    setTableData(list)
  });

  useEffect(() => {
    if (reducer.state && !hasInit.current) {
      updateTable();
    }
  }, [])

  /**
   * Removes a row from table
   *
   * @param {object} row
   */
  const removeItem = (row) => {
    const _tableData = tableData.filter((r) => row._id !== r._id);
    setTableData(_tableData);
  };

  const getTableColumns = () => {
    const names = [
      'name',
      'term',
      'code',
      ...(predicate.fields ? ['action'] : []),
    ];

    const columns = [];

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
        <div className="text-danger mx-3">
          <i
            onClick={() => removeItem(row)}
            role="button"
            aria-label={`Trash ${row.code}`}
            className="bi bi-trash"
          >
            &nbsp;
          </i>
        </div>
      ),
    });
    return columns;
  };

  /**
   * Fetches a single code.
   *
   * @async
   * @param {{ predicate: any; _query: any; regulatingAction: any; }} props
   * @param {object} props.predicate
   * @param {string} props._query
   * @param {string} props.regulatingAction
   * @returns {*}
   */
  const fetchVocabulary = async ({ predicate, _query, regulatingAction, row, query }) => {
    const data = await API.fetch({
      url: URLS.api.local(`ontology/${predicate.field}`),
      token: null,
      body: {
        query: _query,
      },
    });
   
    if (Array.isArray(data.result)) {
       handleMarkers({
         options: uploadRows.current,
         predicate,
         _query,
         data,
         regulatingAction,
       });
    } else {
      tableErrors.current.push(
        formatErrorRow({
          error: (
            <span>
              {data.result?.error || JSON.stringify(data.result)} on search of
              column <code>id</code> with value <code>{query}</code>
            </span>
          ),
          row,
        }),
      );
    }
     
  };

  /**
   * Validate the rows from the uploaded CSV.
   *
   * @param {object} uploadData
   */
  const validateRows = async (uploadData) => {
    setTableBusy(true);
    let _query, regulatingAction, prefix, error;
    const promises = [];
    const regulatedActions = flipObj(PREDICATE.regulatedActions);
    let row = 1;
    for (const d of uploadData) {
      prefix = PREDICATE.prefixIds[d.type.toLowerCase()];
      _query = d.id.includes(':') ? d.id : prefix + d.id;
      regulatingAction = regulatedActions[d.action];
      if (prefix && regulatingAction) {
        promises.push(fetchVocabulary({ predicate, _query, regulatingAction, row, query: d.id }));
      } else {
        error = !prefix ? (
          <span>
            Invalid type {d.type}. Available <code>gene</code> and{' '}
            <code>protein</code>
          </span>
        ) : (
          <span>
            Invalid action {d.action}. Available <code>1, -1 and 0</code>.
          </span>
        );
        tableErrors.current.push(
          formatErrorRow({
            error,
            row,
          }),
        );
      }
      row++
    }

    await Promise.all(promises);
    log.debug('MarkerFormInputs.validateRows', uploadRows.current);
    const results = uploadRows.current.map((i) => i.value);
    addToTable(results);
    setTableBusy(false);
  };

  /**
   * Handles a file upload.
   *
   * @param {File} file
   */
  const onChangeDataFile = (file) => {
    if (file && isValidFile.current) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContents = e.target.result;
        const json = fileContents.csvToJson();
        log.debug('MarkerFormInputs.onChangeDataFile', json);
        tableErrors.current = [];
        validateRows(json);
      };
      reader.onerror = (e) => {
        log.error('MarkerForm.onChangeDataFile', e);
      };
      reader.readAsText(file);
    }
  };

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload: (file) => {
      const isLt4 = file.size / 1024 / 1024 < 4;
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

  /**
   * Handles a user change from
   *
   * @param {*} data
   */
  const handleRadioChange = (data) => {
    log.debug('MarkerFormInputs.handleRadioChange', data);
    onChange({ field: data.target.name, e: data });
  };

  const getTableId = (row) => {
    const key = `${row.code}-${row.action}`;
    return { key, _id: `${crypto.randomUUID()}-${key}` };
  }

  /**
   * List of formValue strings
   *
   * @param {array} list
   */
  const addToTable = (list) => {
    const _tableData = [...tableData];
    const added = new Set(
      _tableData.map((t) => `${t.code}-${t.action}`),
    );
    let newItem;
    for (const item of list) {
      newItem = typeof item === 'string' ? JSON.parse(item) : item;
      let {key, _id} = getTableId(newItem);
      if (!added.has(key)) {
        added.add(key);
        _tableData.push({ _id, ...newItem });
      }
    }
    setTableData(_tableData);
    onChange({ field: predicate.field, value: _tableData });
    log.debug('MarkerFormInputs.handleOnChange', _tableData);
  };

  const handleOnChange = (data) => {
    addToTable([data.e]);
  };

  const getErrorColumns = () => {
    const names = ['row', 'error']
    const columns = []
    for (const n of names) {
      columns.push({
        title: n,
        dataIndex: n,
        key: n,
      });
    }
    return columns
  }

  /**
   * The antd Select is always called on selection of an item.
   *
   * @param {object} predicate
   * @returns {object}
   */
  const _getSearchBehavior = (predicate) => {
    const res = getSearchBehavior(predicate);
    const onSelect = res.onSelect;
    res.onSelect = (v) => {
      handleOnChange({ e: v });
      onSelect();
    };
    return res;
  };

  return (
    <div className="c-markerForm">
      <Flex vertical gap={0}>
        <Form.Label htmlFor={'marker-type'}>
          <strong>Marker type</strong>
        </Form.Label>
        <Radio.Group
          onChange={handleRadioChange}
          defaultValue={PREDICATE.prefixIds.gene}
          buttonStyle="solid"
          id="marker-type"
          name={`marker_type${predicate.fields ? '_regulated' : ''}`}
        >
          <Radio.Button value={PREDICATE.prefixIds.gene}>Gene</Radio.Button>
          <Radio.Button value={PREDICATE.prefixIds.protein}>
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
                name="action"
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
              rowKey={'_id'}
            />
          </div>
        )}
        {tableBusy && <AppSpinner fullscreen={false} />}
        {tableErrors.current.length > 0 && (
          <div>
            <h2 className="p3 text-danger">
              <i className="bi bi-exclamation-triangle"></i>There were errors in
              your upload
            </h2>
            <Table
              className="alert alert-danger"
              columns={getErrorColumns()}
              dataSource={tableErrors.current}
              rowKey={'_id'}
            />
          </div>
        )}
        <SelectField
          p={predicate}
          getOptions={getOptions}
          getSearchBehavior={_getSearchBehavior}
          reducer={reducer}
          useSearchIcon={true}
          mode={'single'}
          hideSelectedValue={true}
          isBusy={busy.selectBusyReducer.state[predicate.field]}
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
                  {predicate.fields && (
                    <li className="list-group-item">
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
                    </li>
                  )}
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
