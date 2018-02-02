import * as types from '../actions/types';

const defaultState = {
  resources: null,
  loadResources: { isLoadingResources: null, loadResourcesStatus: null }
};

export default function resources(state = defaultState, action) {
  switch (action.type) {
    case types.RESOURCES_REQUEST:
      return Object.assign({}, state, {
        loadResources: { isLoadingResources: true, loadResourcesStatus: null }
      });
    case types.LOAD_RESOURCES_SUCCESS:
      return Object.assign({}, state, {
        resources: action.resources,
        loadResources: { isLoadingResources: false, loadResourcesStatus: 'success' }
      });
    case types.LOAD_RESOURCES_FAILURE:
      return Object.assign({}, state, {
        loadResources: { isLoadingResources: false, loadResourcesStatus: 'failure' }
      });
    default:
      return state;
  }
}
