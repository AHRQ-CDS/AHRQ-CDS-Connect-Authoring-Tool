import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import _ from 'lodash';

import * as actions from '../modifiers';
import * as types from '../types';

import localModifiers from '../../data/modifiers';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const modifierMap = _.keyBy(localModifiers, 'id');
const modifiersByInputType = {};

localModifiers.forEach((modifier) => {
  modifier.inputTypes.forEach((inputType) => {
    modifiersByInputType[inputType] = (
      modifiersByInputType[inputType] || []
    ).concat(modifier);
  });
});

describe('modifiers actions', () => {
  describe('loadModifiers', () => {
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it('dispatches a LOAD_MODIFIERS_SUCCESS action on successful load', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });

      const expectedActions = [
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        }
      ];

      return store.dispatch(actions.loadModifiers()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_MODIFIERS_FAILURE action on failure', () => {
      const store = mockStore({});

      const expectedActions = [
        { type: types.MODIFIERS_REQUEST },
        { type: types.LOAD_MODIFIERS_FAILURE, status: '', statusText: '' }
      ];

      return store.dispatch(actions.loadModifiers()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
  describe('loadConversionFunctions', () => {
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it('dispatches a LOAD_CONVERSION_FUNCTIONS_SUCCESS action on successful load', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/conversions',
        method: 'GET',
        response: { status: 200, response: [] }
      });

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

      moxios.stubs.track({
        url: '/authoring/api/config/conversions',
        method: 'GET',
        response: { status: 401, statusText: 'Unauthorized' }
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
