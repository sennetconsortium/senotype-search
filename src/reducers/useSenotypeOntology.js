import { useReducer } from 'react';
import log from 'xac-loglevel'

function useSenotypeOntology({initialState}) {
  function reducer(state, action) {
    log.debug('useSenotypeOntology', state, action);
    switch (action.type) {
      case 'setOne': {
        return { ...state, [action.field]: action.value };
      }
      case 'setAll': {
        return { ... action.value };
      }
    }
    throw Error('useSenotypeOntology > Unknown action: ' + action.type);
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return {state, dispatch};
}

export default useSenotypeOntology;
