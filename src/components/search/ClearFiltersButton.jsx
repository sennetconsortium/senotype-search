import React from "react";
import { Button } from "react-bootstrap";
import { useSearchUIContext } from "search-ui/components/core/SearchUIContext";

function ClearFiltersButton({shouldClearFilters = true}) {
    const { clearSearchTerm, setPageSize, setPageNumber } = useSearchUIContext();

    function handleClearFiltersClick() {
        setPageSize(20)
        setPageNumber(1)
        clearSearchTerm(shouldClearFilters)
        sessionStorage.clear()
    }
 

    return (
        <div className="clear-filter-div">
            <Button onClick={handleClearFiltersClick} className="w-100" >Clear Filters</Button>
        </div>
    );
}

export default ClearFiltersButton