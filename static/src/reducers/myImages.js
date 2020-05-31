import { FETCH_MY_IMAGE_DATA, RECEIVE_MY_IMAGE_DATA } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    images: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_MY_IMAGE_DATA]: (state, payload) =>
        Object.assign({}, state, {
            images: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_MY_IMAGE_DATA]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
