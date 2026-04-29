'use client';
import { useContext, useState } from 'react';
import AppContext from '@/context/AppContext';
import SiderLayout from '@/components/layout/SiderLayout';
import dynamic from 'next/dynamic';
import { SEARCH_SENOTYPE } from '@/config/search/senotype';
import SearchResults from '@/components/search/SearchResults';
import SearchInputField from '@/components/search/SearchInputField';
import AppFloatingButton from '@/components/AppFloatingButton';
import SelectedFacets from '@/components/search/SelectedFacets';
import AppBanner from '@/components/AppBanner';

const SearchUIContainer = dynamic(
  () => import('@/search-ui/components/core/SearchUIContainer'),
);

function Page() {
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

export default Page;
