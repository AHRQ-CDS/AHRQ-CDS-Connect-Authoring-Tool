import configureMockStore from 'redux-mock-store';

import setErrorMessage from '../errors';
import * as types from '../types';

const mockStore = configureMockStore();

describe('error actions', () => {
  describe('setErrorMessage', () => {
    it('dispatches a SET_ERROR_MESSAGE action', () => {
      const store = mockStore({});

      store.dispatch(setErrorMessage('error message'));
      expect(store.getActions()).toEqual([
        { type: types.SET_ERROR_MESSAGE, errorMessage: 'error message' }
      ]);
    });
  });
});
