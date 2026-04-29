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
  mode = 'multiple',
}) {

  const data = reducer
  return (
    <>
      <InputField
        dropIcon={
          PREDICATE.isExternalSource(p.field) || useSearchIcon ? (
            <i className="bi bi-search"></i>
          ) : undefined
        }
        key={p.field}
        labelTooltip={p.ui.tooltip}
        label={p.label || SEARCH_SENOTYPE.searchQuery.facets[p.field]?.label}
        id={p.field}
        selectData={getOptions(p)}
        onChange={onChange}
        controlProps={{
          ...getSearchBehavior(p),
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
          value:
            data && data[p.field]
              ? mode.eq('multiple') ? data[p.field].map((s) => {
                return { label: s.title || s.term, value: JSON.stringify(s) };
              }) : {label: data[p.field][0].term, value: JSON.stringify(data[p.field][0])}
              : undefined,
          required: p.ui.required,
        }}
      />
    </>
  );
}

export default SelectField;
