import { FETCH_PUBLIC_IMAGE_DATA, RECEIVE_PUBLIC_IMAGE_DATA } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    images: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_PUBLIC_IMAGE_DATA]: (state, payload) =>
        Object.assign({}, state, {
            images: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PUBLIC_IMAGE_DATA]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
