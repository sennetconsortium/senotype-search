import React from 'react';
import { Layout,  Skeleton } from 'antd';
import Facets from 'search-ui/components/core/Facets';
import { useSearchUIContext } from 'search-ui/components/core/SearchUIContext';
const { Content, Sider } = Layout;
import ClearFiltersButton from './ClearFiltersButton';
import ENVS from '@/lib/envs';

function SiderFacets({}) {
  const { wasSearched, rawResponse } = useSearchUIContext();
  const transformFunction = (value, facet) => {
    return value.upCaseFirst();
  };

  return (
    <div className="c-siderFacets">
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
        {wasSearched && (rawResponse?.records === undefined || rawResponse?.records[ENVS.index.senotype].length <= 0) && (
          <span>No facets to show.</span>
        )}
      </Sider>
    </div>
  );
}

export default SiderFacets;
