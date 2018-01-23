import {
  VALUE_SETS_REQUEST, LOAD_VALUE_SETS_SUCCESS, LOAD_VALUE_SETS_FAILURE
} from '../actions/types';

const defaultState = {
  valueSets: null,
  loadValueSets: { isLoadingValueSets: null, loadValueSetsStatus: null }
};

export default function valueSets(state = defaultState, action) {
  switch (action.type) {
    case VALUE_SETS_REQUEST:
      return Object.assign({}, state, {
        loadValueSets: { isLoadingValueSets: true, loadValueSetsStatus: null }
      });
    case LOAD_VALUE_SETS_SUCCESS:
      return Object.assign({}, state, {
        valueSets: action.valueSets.expansion,
        loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'success' }
      });
    case LOAD_VALUE_SETS_FAILURE:
      return Object.assign({}, state, {
        loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'failure' }
      });
    default:
      return state;
  }
}
