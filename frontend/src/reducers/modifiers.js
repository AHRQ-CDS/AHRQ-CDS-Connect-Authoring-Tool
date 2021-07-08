import * as types from '../actions/types';

const defaultState = {
  conversionFunctions: [],
  loadConversionFunctions: { isLoadingConversionFunctions: null, loadConversionFunctionsStatus: null }
};

export default function modifiers(state = defaultState, action) {
  switch (action.type) {
    case types.CONVERSION_FUNCTIONS_REQUEST:
      return {
        ...state,
        loadConversionFunctions: { isLoadingConversionFunctions: true, loadConversionFunctionsStatus: null }
      };
    case types.LOAD_CONVERSION_FUNCTIONS_SUCCESS:
      return {
        ...state,
        conversionFunctions: action.conversionFunctions,
        loadConversionFunctions: { isLoadingConversionFunctions: false, loadConversionFunctionsStatus: 'success' }
      };
    case types.LOAD_CONVERSION_FUNCTIONS_FAILURE:
      return {
        ...state,
        loadConversionFunctions: { isLoadingConversionFunctions: false, loadConversionFunctionsStatus: 'failure' }
      };
    default:
      return state;
  }
}
