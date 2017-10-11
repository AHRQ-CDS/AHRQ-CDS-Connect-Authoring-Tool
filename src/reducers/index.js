import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './auth';
import errorsReducer from './errors';

const rootReducer = combineReducers({
  routing: routerReducer,
  auth: authReducer,
  errors: errorsReducer
});

export default rootReducer;
