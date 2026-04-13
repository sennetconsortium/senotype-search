import { useSearchUIContext } from 'search-ui/components/core/SearchUIContext';
import { Select } from 'antd';

function PageSizer({ options }) {
  const { wasSearched, filters, rawResponse, setPageSize } =
    useSearchUIContext();

  const onChange = (value) => {
    setPageSize(Number(value));
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  return (
    <div>
      <Select
        showSearch={{ optionFilterProp: 'label', onSearch }}
        placeholder="Rows per page"
        onChange={onChange}
        options={options}
      />
    </div>
  );
}

export default PageSizer;
