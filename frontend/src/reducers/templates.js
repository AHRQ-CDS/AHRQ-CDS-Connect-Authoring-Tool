import {
  TEMPLATES_REQUEST, LOAD_TEMPLATES_SUCCESS, LOAD_TEMPLATES_FAILURE
} from '../actions/types';

const defaultState = {
  templates: null,
  loadTemplates: { isLoadingTemplates: null, loadTemplatesStatus: null }
};

export default function templates(state = defaultState, action) {
  switch (action.type) {
    case TEMPLATES_REQUEST:
      return Object.assign({}, state, {
        loadTemplates: { isLoadingTemplates: true, loadTemplatesStatus: null }
      });
    case LOAD_TEMPLATES_SUCCESS:
      return Object.assign({}, state, {
        templates: action.templates,
        loadTemplates: { isLoadingTemplates: false, loadTemplatesStatus: 'success' }
      });
    case LOAD_TEMPLATES_FAILURE:
      return Object.assign({}, state, {
        loadTemplates: { isLoadingTemplates: false, loadTemplatesStatus: 'failure' }
      });
    default:
      return state;
  }
}
