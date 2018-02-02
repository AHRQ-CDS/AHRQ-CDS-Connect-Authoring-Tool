import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import loadResources from '../../actions/resources';
import * as types from '../../actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('resource actions', () => {
  describe('loadResources', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_RESOURCES_SUCCESS action on successful load', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/resources',
        method: 'GET',
        response: { status: 200, response: [] }
      });

      const expectedActions = [
        { type: types.RESOURCES_REQUEST },
        { type: types.LOAD_RESOURCES_SUCCESS, resources: [] }
      ];

      return store.dispatch(loadResources()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_RESOURCES_FAILURE action on failure', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/resources',
        method: 'GET',
        response: { status: 401, statusText: 'Unauthorized' }
      });

      const expectedActions = [
        { type: types.RESOURCES_REQUEST },
        { type: types.LOAD_RESOURCES_FAILURE, status: 401, statusText: 'Unauthorized' }
      ];

      return store.dispatch(loadResources()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
