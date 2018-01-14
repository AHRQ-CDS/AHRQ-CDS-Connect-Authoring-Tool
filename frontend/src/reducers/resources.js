import {
  RESOURCES_REQUEST, LOAD_RESOURCES_SUCCESS, LOAD_RESOURCES_FAILURE
} from '../actions/types';

const defaultState = {
  resources: null,
  loadResources: { isLoadingResources: null, loadResourcesStatus: null }
};

export default function resources(state = defaultState, action) {
  switch (action.type) {
    case RESOURCES_REQUEST:
      return Object.assign({}, state, {
        loadResources: { isLoadingResources: true, loadResourcesStatus: null }
      });
    case LOAD_RESOURCES_SUCCESS:
      return Object.assign({}, state, {
        resources: action.resources,
        loadResources: { isLoadingResources: false, loadResourcesStatus: 'success' }
      });
    case LOAD_RESOURCES_FAILURE:
      return Object.assign({}, state, {
        loadResources: { isLoadingResources: false, loadResourcesStatus: 'failure' }
      });
    default:
      return state;
  }
}
