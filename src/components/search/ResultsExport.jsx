import { autoBlobDownloader } from '@/lib/general';
import { DownloadOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Button } from 'react-bootstrap';

/**
 * Generates a tsv of passed data
 *
 * @param {{ data: any; columns: any; }} props
 * @param {array} props.data List of data
 * @param {array} props.columns antd.Table columns
 * @returns {*}
 */
function ResultsExport({ data, columns, children }) {
  const handleExport = () => {
    let tableDataTSV = '';
    const _columns = Array.from(columns);
    for (let col of _columns) {
      if (col.title.length) {
        tableDataTSV += `${col.title}\t`;
      }
    }
    tableDataTSV += '\n';
    for (const d of data) {
      for (let col of _columns) {
        if (col.title.length) {
          tableDataTSV += `${JSON.stringify(d[col.dataIndex] || '')}\t`;
        }
      }
      tableDataTSV += '\n';
    }
    
    autoBlobDownloader(
      [tableDataTSV],
      'text/tab-separated-values',
      `senotypes-${new Date().toLocaleString()}.tsv`,
    );
  };

  return (
    <div className="c-searchResults__export mx-2">
      <Tooltip placement="top" title={'Export table data'}>
        <Button onClick={handleExport}>
          <DownloadOutlined />
        </Button>
      </Tooltip>
      {children}
    </div>
  );
}

export default ResultsExport;
