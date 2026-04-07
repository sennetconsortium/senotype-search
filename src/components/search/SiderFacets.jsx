import React from 'react';
import { Layout, Menu } from 'antd';
import Facets from 'search-ui/components/core/Facets'
import { useSearchUIContext } from "search-ui/components/core/SearchUIContext";
const { Content, Sider } = Layout;
import '@/lib/general'
import ClearFiltersButton from './ClearFiltersButton';

function SiderFacets({}) {
  const { wasSearched } = useSearchUIContext()
  const transformFunction = (value, facet) => {
    return value.upCaseFirst()
  }

  return (
    <div className='c-SiderFacets'>
      <ClearFiltersButton />
      <Sider className='mt-4 mb-4 container--card bg-white' breakpoint="lg" collapsedWidth="0" width={'100%'}>
        {wasSearched && <Facets transformFunction={transformFunction} />}
      </Sider>
    </div>
  )
}

export default SiderFacets