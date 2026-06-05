'use client';

import { SEARCH_SENOTYPE } from '@/config/search/senotype';
import SiderLayout from '@/components/layout/SiderLayout';
import AppBanner from '@/components/AppBanner';
import SearchInputField from '@/components/search/SearchInputField';
import SelectedFacets from '@/components/search/SelectedFacets';
import AppFloatingButton from '@/components/AppFloatingButton';
import SearchResults from '@/components/search/SearchResults';
import { useContext, useState } from 'react';
import AppContext from '@/context/AppContext';
import dynamic from 'next/dynamic';

const SearchUIContainer = dynamic(
  () => import('@/search-ui/components/core/SearchUIContainer'),
);
export default function SearchClientComponent() {
  const { auth } = useContext(AppContext);
  const [showSider, setShowSider] = useState(true);

  return (
    <SearchUIContainer
      config={SEARCH_SENOTYPE}
      name="senotype"
      authState={auth}
    >
      <SiderLayout
        showSider={showSider}
        prefixChildren={
          <>
            <AppBanner />
            <SearchInputField />
            <SelectedFacets />
          </>
        }
      >
        <AppFloatingButton
          show={showSider}
          setShow={setShowSider}
          text={'Search Facets'}
        />

        <SearchResults />
      </SiderLayout>
    </SearchUIContainer>
  );
}
