import * as types from '../../actions/types';
import reducer from '../../reducers/errors';

describe('errors reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ errorMessage: '' });
  });

  it('should handle setting an error message', () => {
    const action = { type: types.SET_ERROR_MESSAGE, errorMessage: 'Test error message' };
    const newState = { errorMessage: 'Test error message' };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { errorMessage: 'Old test error message' };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
