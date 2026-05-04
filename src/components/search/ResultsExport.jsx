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
    let tableDataCSV = '';
    const _columns = Array.from(columns);
    const csv = (d) => {
      let sep, c, val;
      for (let i = 0; i < _columns.length; i++) {
        sep = i === _columns.length - 1 ? '' : ',';
        c = _columns[i];
        if (c.title.length) {
          val = d ? d[c.dataIndex] || '' : c.title;
          tableDataCSV += `"${typeof val === 'string' ? val : JSON.stringify(val)}"${sep}`;
        }
        
      }
    };
    csv();
    tableDataCSV += '\n';
    for (const d of data) {
      csv(d);
      tableDataCSV += '\n';
    }
    
    autoBlobDownloader(
      [tableDataCSV],
      'text/comma-separated-values',
      `senotypes-${new Date().toLocaleString()}.csv`,
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
