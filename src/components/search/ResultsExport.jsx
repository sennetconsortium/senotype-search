import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'react-bootstrap';

// TODO add logic for export
function ResultsExport({ data }) {
  return (
    <div className="c-searchResults__export mx-2">
      <Button>
        <DownloadOutlined />
      </Button>
    </div>
  );
}

export default ResultsExport;
