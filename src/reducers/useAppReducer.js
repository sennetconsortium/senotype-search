import { useReducer } from 'react';
import log from 'xac-loglevel'

function useAppReducer({initialState}) {
  function reducer(state, action) {
    log.debug('useAppReducer', state, action);
    if (action.field) {
      return { ...state, [action.field]: action.value };
    } else {
      return { ... action.value };
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return {state, dispatch};
}

export default useAppReducer;
