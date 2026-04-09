import { SearchOutlined } from '@ant-design/icons';
import React from 'react'
import {Form, InputGroup, Button} from 'react-bootstrap';
import { useSearchUIContext } from "search-ui/components/core/SearchUIContext";

function SearchInputField() {
  const { setSearchTerm } = useSearchUIContext()
  const handleSearch = (e) => {
    const query = document.getElementById('query').value
    setSearchTerm(query, { shouldClearFilters: true })
  }

  const handleOnKeydown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }
  return (
    <div>
      <InputGroup className="mb-3 mt-3" size="lg">
        <Form.Control
          id="query"
          name="query"
          placeholder="Search for a senotype"
          aria-label="Search for a senotype"
          onKeyDown={handleOnKeydown} 
        />
        <Button onClick={handleSearch} variant="primary" id="searchField">
          <SearchOutlined />
        </Button>
      </InputGroup>
    </div>
  )
}

export default SearchInputField