import React from 'react';
import { Layout, Menu, Skeleton } from 'antd';
import Facets from 'search-ui/components/core/Facets';
import { useSearchUIContext } from 'search-ui/components/core/SearchUIContext';
const { Content, Sider } = Layout;
import ClearFiltersButton from './ClearFiltersButton';

function SiderFacets({}) {
  const { wasSearched } = useSearchUIContext();
  const transformFunction = (value, facet) => {
    return value.upCaseFirst();
  };

  return (
    <div className="c-SiderFacets">
      <ClearFiltersButton />
      <Sider className="mt-4 mb-4 container--card bg-white" width={'100%'}>
        {!wasSearched && (
          <>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} />
              ))}
          </>
        )}
        {wasSearched && <Facets transformFunction={transformFunction} />}
      </Sider>
    </div>
  );
}

export default SiderFacets;
