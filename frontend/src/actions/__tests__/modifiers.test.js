import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import * as actions from '../modifiers';
import * as types from '../types';

import mockModifiers from '../../mocks/modifiers/mockModifiers';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const modifiersByInputType = {};

mockModifiers.forEach(modifier => {
  modifier.inputTypes.forEach(inputType => {
    modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
  });
});

describe('modifiers actions', () => {
  describe('loadConversionFunctions', () => {
    it('dispatches a LOAD_CONVERSION_FUNCTIONS_SUCCESS action on successful load', () => {
      const store = mockStore({});

      nock('http://localhost').get('/authoring/api/config/conversions').reply(200, []);

      const expectedActions = [
        { type: types.CONVERSION_FUNCTIONS_REQUEST },
        {
          type: types.LOAD_CONVERSION_FUNCTIONS_SUCCESS,
          conversionFunctions: []
        }
      ];

      return store.dispatch(actions.loadConversionFunctions()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_CONVERSION_FUNCTIONS_FAILURE action on failure', () => {
      const store = mockStore({});

      nock('http://localhost')
        .get('/authoring/api/config/conversions')
        .reply(401, function () {
          this.req.response.statusMessage = 'Unauthorized';
          return { status: 401 };
        });

      const expectedActions = [
        { type: types.CONVERSION_FUNCTIONS_REQUEST },
        {
          type: types.LOAD_CONVERSION_FUNCTIONS_FAILURE,
          status: 401,
          statusText: 'Unauthorized'
        }
      ];

      return store.dispatch(actions.loadConversionFunctions()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
