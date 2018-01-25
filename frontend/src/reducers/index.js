import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './auth';
import errorsReducer from './errors';
import artifactsReducer from './artifacts';
import templatesReducer from './templates';
import resourcesReducer from './resources';
import valueSetsReducer from './value_sets';
import vsacReducer from './vsac';

const rootReducer = combineReducers({
  routing: routerReducer,
  auth: authReducer,
  errors: errorsReducer,
  artifacts: artifactsReducer,
  templates: templatesReducer,
  resources: resourcesReducer,
  valueSets: valueSetsReducer,
  vsac: vsacReducer
});

export default rootReducer;
