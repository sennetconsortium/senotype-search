import { useEffect } from 'react';
import { Select } from 'antd';
import log from 'xac-loglevel';
import { useSearchUIContext } from 'search-ui/components/core/SearchUIContext';

function PageSizer({ options, setTableData }) {
  const { pageSize, setPageSize } = useSearchUIContext();

  useEffect(() => {
    console.log('PAGE', pageSize);
  }, [pageSize]);

  const onChange = (value) => {
    setTableData([]);
    setPageSize(Number(value));
  };

  const onSearch = (value) => {
    log.info('PageSizer.onSearch', value);
  };

  return (
    <div className="c-searchResults__pageSizer">
      <Select
        value={pageSize}
        showSearch={{ optionFilterProp: 'label', onSearch }}
        placeholder="Rows per page"
        onChange={onChange}
        options={options}
      />
    </div>
  );
}

export default PageSizer;
