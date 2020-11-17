import * as types from '../../actions/types';
import reducer from '../modifiers';

describe('modifiers reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      modifierMap: {},
      modifiersByInputType: {},
      conversionFunctions: [],
      loadModifiers: { isLoadingModifiers: null, loadModifiersStatus: null },
      loadConversionFunctions: { isLoadingConversionFunctions: null, loadConversionFunctionsStatus: null }
    });
  });

  it('should handle getting modifiers', () => {
    let action = { type: types.MODIFIERS_REQUEST };
    let newState = {
      loadModifiers: { isLoadingModifiers: true, loadModifiersStatus: null }
    };
    expect(reducer([], action)).toEqual(newState);

    const previousState = {
      loadModifiers: { isLoadingModifiers: false, loadModifiersStatus: 'Test' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    const testModifierMap = {
      AllTrue: {
        id: 'AllTrue',
        name: 'All True',
        inputTypes: ['list_of_booleans'],
        returnType: 'boolean',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'AllTrue'
      }
    };
    const testModifiersByInputType = {
      list_of_booleans: [
        {
          id: 'AllTrue',
          name: 'All True',
          inputTypes: ['list_of_booleans'],
          returnType: 'boolean',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'AllTrue'
        }
      ]
    };
    action = {
      type: types.LOAD_MODIFIERS_SUCCESS,
      modifierMap: testModifierMap,
      modifiersByInputType: testModifiersByInputType
    };
    newState = {
      modifierMap: testModifierMap,
      modifiersByInputType: testModifiersByInputType,
      loadModifiers: { isLoadingModifiers: false, loadModifiersStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_MODIFIERS_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = {
      loadModifiers: { isLoadingModifiers: false, loadModifiersStatus: 'failure' }
    };
    expect(reducer(previousState, action)).toEqual(newState);
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
