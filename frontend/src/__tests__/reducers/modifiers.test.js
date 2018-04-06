import * as types from '../../actions/types';
import reducer from '../../reducers/modifiers';

describe.only('modifiers reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      conversionFunctions: [],
      loadConversionFunctions: { isLoadingConversionFunctions: null, loadConversionFunctionsStatus: null }
    });
  });

  it('should handle getting conversion functions', () => {
    let action = { type: types.CONVERSION_FUNCTIONS_REQUEST };
    let newState = {
      loadConversionFunctions: { isLoadingConversionFunctions: true, loadConversionFunctionsStatus: null }
    };
    expect(reducer([], action)).toEqual(newState);

    const previousState = {
      loadConversionFunctions: { isLoadingConversionFunctions: false, loadConversionFunctionsStatus: 'Test' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    const testFunctions = [{ name: 'function.name', description: 'Test function description' }];
    action = { type: types.LOAD_CONVERSION_FUNCTIONS_SUCCESS, conversionFunctions: testFunctions };
    newState = {
      conversionFunctions: testFunctions,
      loadConversionFunctions: { isLoadingConversionFunctions: false, loadConversionFunctionsStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_CONVERSION_FUNCTIONS_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = {
      loadConversionFunctions: { isLoadingConversionFunctions: false, loadConversionFunctionsStatus: 'failure' }
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
