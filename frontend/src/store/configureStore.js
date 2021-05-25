import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import templateMerger from '../middleware/template_merger';

export default function configureStore(initialState) {
  const middleware = [promiseMiddleware, thunkMiddleware, templateMerger];
  // disable the redux-logger in a production environment
  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));

  return store;
}
