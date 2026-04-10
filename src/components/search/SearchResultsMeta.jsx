import React from 'react'
import { useSearchUIContext } from "search-ui/components/core/SearchUIContext";

function SearchResultsMeta() {
  const { wasSearched, filters, rawResponse } = useSearchUIContext()
  if (!wasSearched) {
    return <></>
  }

  const renderText = () => {
    const info = rawResponse.info.senotypes
    if (!info.total_result_count) {
      return <></>
    }
    let pageNumber = info.current_page;

    const from = ((pageNumber - 1) * info.per_page) + 1
    const to = Math.min(pageNumber * info.per_page, info.total_result_count)
    return (<div>Showing <strong>{from}</strong> to <strong>{to}</strong> results out of <strong>{info.total_result_count}</strong>.</div>)
  }

  return (
    <div className='mt-2 mb-2'>{renderText()}
    </div>
  )
}

export default SearchResultsMeta