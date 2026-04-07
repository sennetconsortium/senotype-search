'use client'
import AppContext from "@/context/AppContext";
import SiderLayout from '@/components/layout/SiderLayout'
import dynamic from "next/dynamic";
import React, { useContext } from 'react'
import { SEARCH_SENOTYPE } from "@/config/search/senotype";
import SearchResults from "@/components/search/SearchResults";
import SearchInputField from "@/components/search/SearchInputField";

const SearchUIContainer = dynamic(() => import("@/search-ui/components/core/SearchUIContainer"))

function page() {
  const { auth } = useContext(AppContext)

  return (
    <SearchUIContainer config={SEARCH_SENOTYPE} name='senotype' authState={auth}>
      <SiderLayout prefixChildren={
        <SearchInputField />
      }>
        <SearchResults />
      </SiderLayout>
    </SearchUIContainer>
  )
}

export default page