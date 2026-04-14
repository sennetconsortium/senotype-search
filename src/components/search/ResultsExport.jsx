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
function ResultsExport({ data, columns }) {
  const handleExport = () => {
    let tableDataTSV = '';
    const _columns = Array.from(columns);
    for (let col of _columns) {
      if (col.name.length) {
        tableDataTSV += `${col.name}\t`;
      }
    }
    tableDataTSV += '\n';
    for (const d of data) {
      for (let col of _columns) {
        if (col.name.length) {
          tableDataTSV += `${d[col.id]}\t`;
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
    </div>
  );
}

export default ResultsExport;
