import * as types from '../actions/types';

const defaultState = {
  valueSets: null,
  loadValueSets: { isLoadingValueSets: null, loadValueSetsStatus: null }
};

export default function valueSets(state = defaultState, action) {
  switch (action.type) {
    case types.VALUE_SETS_REQUEST:
      return {
        ...state,
        loadValueSets: { isLoadingValueSets: true, loadValueSetsStatus: null }
      };
    case types.LOAD_VALUE_SETS_SUCCESS:
      return {
        ...state,
        valueSets: action.valueSets.expansion,
        loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'success' }
      };
    case types.LOAD_VALUE_SETS_FAILURE:
      return {
        ...state,
        loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'failure' }
      };
    default:
      return state;
  }
}
