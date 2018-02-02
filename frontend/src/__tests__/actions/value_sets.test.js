import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import loadValueSets from '../../actions/value_sets';
import * as types from '../../actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('value sets actions', () => {
  describe('loadValueSets', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_VALUE_SETS_SUCCESS action on successful load', () => {
      const store = mockStore({});
      const selection = 'set_one';

      moxios.stubs.track({
        url: `/authoring/api/config/valuesets/${selection}`,
        method: 'GET',
        response: { status: 200, response: [] }
      });

      const expectedActions = [
        { type: types.VALUE_SETS_REQUEST },
        { type: types.LOAD_VALUE_SETS_SUCCESS, valueSets: [] }
      ];

      return store.dispatch(loadValueSets(selection)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_VALUE_SETS_FAILURE action on failure', () => {
      const store = mockStore({});
      const selection = 'set_one';

      moxios.stubs.track({
        url: `/authoring/api/config/valuesets/${selection}`,
        method: 'GET',
        response: { status: 401, statusText: 'Unauthorized' }
      });

      const expectedActions = [
        { type: types.VALUE_SETS_REQUEST },
        { type: types.LOAD_VALUE_SETS_FAILURE, status: 401, statusText: 'Unauthorized' }
      ];

      return store.dispatch(loadValueSets(selection)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
