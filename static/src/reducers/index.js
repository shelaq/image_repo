import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import data from './data';
import myImages from './myImages';
import publicImages from './publicImages';
import uploadImage from './uploadImage';

const appReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    auth,
    data,
    myImages,
    publicImages,
    uploadImage
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;
