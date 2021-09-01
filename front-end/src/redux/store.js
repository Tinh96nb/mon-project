import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import {homeReducer} from './homeReducer';

const rootReducer = combineReducers({
  home: homeReducer,
})

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

export default store