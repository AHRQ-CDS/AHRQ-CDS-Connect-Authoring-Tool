import * as types from '../../actions/types';
import reducer from '../../reducers/value_sets';

describe('value sets reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      valueSets: null,
      loadValueSets: { isLoadingValueSets: null, loadValueSetsStatus: null }
    });
  });

  it('should handle getting value sets', () => {
    let action = { type: types.VALUE_SETS_REQUEST };
    let newState = { loadValueSets: { isLoadingValueSets: true, loadValueSetsStatus: null }, valueSets: [] };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'Test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_VALUE_SETS_SUCCESS, valueSets: { expansion: 'Test value sets' } };
    newState = {
      valueSets: 'Test value sets',
      loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_VALUE_SETS_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = { loadValueSets: { isLoadingValueSets: false, loadValueSetsStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
