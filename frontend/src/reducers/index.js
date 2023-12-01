import { combineReducers } from 'redux';

import * as types from '../actions/types';
import artifactsReducer from './artifacts';
import authReducer from './auth';
import errorsReducer from './errors';
import navigationReducer from './navigation';
import vsacReducer from './vsac';

const appReducer = combineReducers({
  artifacts: artifactsReducer,
  auth: authReducer,
  errors: errorsReducer,
  navigation: navigationReducer,
  vsac: vsacReducer
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === types.LOGOUT_SUCCESS) {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
