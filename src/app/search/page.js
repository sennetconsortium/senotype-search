'use client';

import { useContext } from 'react';
import { SEARCH_SENOTYPE } from '@/config/search/senotype';
import SiderLayout from '@/components/layout/SiderLayout';
import AppBanner from '@/components/AppBanner';
import SearchInputField from '@/components/search/SearchInputField';
import SelectedFacets from '@/components/search/SelectedFacets';
import SearchResults from '@/components/search/SearchResults';
import AppContext from '@/context/AppContext';
import dynamic from 'next/dynamic';


const SearchUIContainer = dynamic(
  () => import('@/search-ui/components/core/SearchUIContainer'),
);

export default function SearchClientComponent() {
  const { auth } = useContext(AppContext);
  
  return (
    <SearchUIContainer
      config={SEARCH_SENOTYPE}
      name="senotype"
      authState={auth}
    >
      <SiderLayout
        firstRowPrefixChildren={
          <>
            <AppBanner />
            <SearchInputField />
            <SelectedFacets />
          </>
        }
      >
        <SearchResults />
      </SiderLayout>
    </SearchUIContainer>
  );
}
