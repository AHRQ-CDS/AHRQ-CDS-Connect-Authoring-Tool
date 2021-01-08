import * as types from 'actions/types';
import reducer from '../vsac';

describe('vsac reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      apiKey: null
    });
  });

  it('should handle setting the vsac api key', () => {
    const action = { type: types.SET_VSAC_API_KEY, apiKey: 'key' };
    const newState = { apiKey: 'key' };
    expect(reducer([], action)).toEqual(newState);
  });
});
