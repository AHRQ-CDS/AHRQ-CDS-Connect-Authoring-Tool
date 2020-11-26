import { combineReducers } from 'redux';

import * as types from '../actions/types';
import authReducer from './auth';
import errorsReducer from './errors';
import artifactsReducer from './artifacts';
import testingReducer from './testing';
import templatesReducer from './templates';
import vsacReducer from './vsac';
import modifiersReducer from './modifiers';
import externalCqlReducer from './external_cql';

const appReducer = combineReducers({
  auth: authReducer,
  errors: errorsReducer,
  artifacts: artifactsReducer,
  testing: testingReducer,
  templates: templatesReducer,
  vsac: vsacReducer,
  modifiers: modifiersReducer,
  externalCQL: externalCqlReducer
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === types.LOGOUT_SUCCESS) {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
