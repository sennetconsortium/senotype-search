
import { useState, useEffect, useRef } from 'react';
import { SEARCH_SENOTYPE } from '@/config/search/senotype';
import InputField from './InputField';
import PREDICATE from '@/lib/predicate';
import AppSpinner from '../AppSpinner';

function SelectField({
  p,
  getOptions,
  getSearchBehavior,
  reducer,
  useSearchIcon,
  onChange,
  isBusy,
  hideSelectedValue = false,
  mode = 'multiple',
}) {
  
  const data = reducer.state
  const getLabel = (item) => {
    return item.title || item.term || item.marker?.name || item.marker?.term
  }
  const [selectOpen, setSelectOpen] = useState(getSearchBehavior(p).open)
  const hasSearchIcon = PREDICATE.isExternalSource(p.field) || useSearchIcon
  const selectRef = useRef(null)

  const resolveValues = () => {
    return data &&
      Object.values(data).length > 0 &&
      data[p.field] &&
      !hideSelectedValue
      ? Array.isArray(data[p.field])
        ? data[p.field].map((s) => {
            return {
              label: getLabel(s),
              value: JSON.stringify(s),
            };
          })
        : {
            label: getLabel(data[p.field]),
            value: JSON.stringify(data[p.field]),
          }
      : undefined;
  };

  const resolveValueOptions = () => {
    const values = resolveValues()
    return Array.isArray(values) ? values : [values]
  }

  const resolveOptions = () => {
    const options = getOptions(p) // ontology and search options
    const values = resolveValues() 
    if (hasSearchIcon && !options.length && values) {
      return Array.isArray(values) ? values : [values] // otherwise show the values as options
    }
    return options
  }

  const [selectData, setSelectData] = useState(resolveOptions())

  useEffect(() => {
    if (!isBusy) {
      // the search results have been updated from fetchVocabulary, apply them
      setSelectData(resolveOptions())
    }
  }, [isBusy])

  const _getSearchBehavior = (p) => {
    const selectBehavior = getSearchBehavior(p)
    const onInputKeyDown = selectBehavior.onInputKeyDown
    if (hasSearchIcon) {
      selectBehavior.open = selectOpen
      selectBehavior.onBlur = () => {
        console.log('blur')
        setSelectOpen(undefined)
      }
      selectBehavior.onSelect = () => setSelectOpen(undefined)
      selectBehavior.onFocus = () => {
        setSelectData(resolveValueOptions())
        setSelectOpen(true)
      }
      selectBehavior.onInputKeyDown = (e) => {
        if (e.key === 'Enter') {
          setSelectData([])
        }
        onInputKeyDown(e)
      }
      
    }
    return selectBehavior
  }
  const handleSuffixClick = (e) => {
    e.stopPropagation()
    setSelectData([])
    setSelectOpen(true)
  }
  
  return (
    <>
      <InputField
        dropIcon={
          hasSearchIcon ? (
            <>
            <i className="bi bi-search" style={{cursor: 'pointer'}} onClick={handleSuffixClick}  onMouseDown={handleSuffixClick}></i></>
          ) : undefined
        }
        key={p.field}
        labelTooltip={p.ui.tooltip}
        label={p.label || SEARCH_SENOTYPE.searchQuery.facets[p.field]?.label}
        id={p.field}
        selectData={selectData}
        onChange={onChange}
        controlProps={{
          ref: selectRef,
          ..._getSearchBehavior(p),
          required: p.ui.required,
          mode,
          notFoundContent: (
            <>
              {!isBusy && (
                <span className="text-black">
                  {p.ui.tooltip && (
                    <span>
                      {p.ui.tooltip}
                      <br /> Then press <strong>ENTER or return</strong> key to
                      perform search.
                    </span>
                  )}
                  {!p.ui.tooltip && <span>No results found.</span>}
                </span>
              )}
              {isBusy && <AppSpinner size={'small'} fullscreen={false} />}
            </>
          ),
          value: resolveValues(),
          required: p.ui.required,
        }}
      />
    </>
  );
}

export default SelectField;
