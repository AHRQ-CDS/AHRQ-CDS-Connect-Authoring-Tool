import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import { loadConversionFunctions } from '../modifiers';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('modifiers actions', () => {
  describe('loadConversionFunctions', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_CONVERSION_FUNCTIONS_SUCCESS action on successful load', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/conversions',
        method: 'GET',
        response: { status: 200, response: [] }
      });

      const expectedActions = [
        { type: types.CONVERSION_FUNCTIONS_REQUEST },
        { type: types.LOAD_CONVERSION_FUNCTIONS_SUCCESS, conversionFunctions: [] }
      ];

      return store.dispatch(loadConversionFunctions()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_CONVERSION_FUNCTIONS_FAILURE action on failure', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/conversions',
        method: 'GET',
        response: { status: 401, statusText: 'Unauthorized' }
      });

      const expectedActions = [
        { type: types.CONVERSION_FUNCTIONS_REQUEST },
        { type: types.LOAD_CONVERSION_FUNCTIONS_FAILURE, status: 401, statusText: 'Unauthorized' }
      ];

      return store.dispatch(loadConversionFunctions()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
