import * as types from '../actions/types';

const defaultState = {
  modifierMap: {},
  modifiersByInputType: {},
  conversionFunctions: [],
  loadModifiers: { isLoadingModifiers: null, loadModifiersStatus: null },
  loadConversionFunctions: { isLoadingConversionFunctions: null, loadConversionFunctionsStatus: null }
};

export default function modifiers(state = defaultState, action) {
  switch (action.type) {
    case types.MODIFIERS_REQUEST:
      return {
        ...state,
        loadModifiers: { isLoadingModifiers: true, loadModifiersStatus: null }
      };
    case types.LOAD_MODIFIERS_SUCCESS:
      return {
        ...state,
        modifierMap: action.modifierMap,
        modifiersByInputType: action.modifiersByInputType,
        loadModifiers: { isLoadingModifiers: false, loadModifiersStatus: 'success' }
      };
    case types.LOAD_MODIFIERS_FAILURE:
      return {
        ...state,
        loadModifiers: { isLoadingModifiers: false, loadModifiersStatus: 'failure' }
      };
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
