import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import { homeReducer } from './homeReducer';
import { userReducer } from './userReducer';
import { nftReducer } from './nftReducer';

const rootReducer = combineReducers({
  home: homeReducer,
  user: userReducer,
  nft: nftReducer,
})

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

export default store