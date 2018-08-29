import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as types from '../actions/types';
import authReducer from './auth';
import errorsReducer from './errors';
import artifactsReducer from './artifacts';
import testingReducer from './testing';
import templatesReducer from './templates';
import valueSetsReducer from './value_sets';
import vsacReducer from './vsac';
import modifiersReducer from './modifiers';

const appReducer = combineReducers({
  routing: routerReducer,
  auth: authReducer,
  errors: errorsReducer,
  artifacts: artifactsReducer,
  testing: testingReducer,
  templates: templatesReducer,
  valueSets: valueSetsReducer,
  vsac: vsacReducer,
  modifiers: modifiersReducer
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === types.LOGOUT_SUCCESS) {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
