import { UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_RESPONSE } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    image: null,
    isUploading: false,
    uploadResultMessage:''
};

export default createReducer(initialState, {
    [UPLOAD_IMAGE_RESPONSE]: (state, payload) =>
        Object.assign({}, state, {
            image: payload.data,
            uploadResultMessage: 'Image successfully uploaded.',
            isUploading: false
        }),
    [UPLOAD_IMAGE_REQUEST]: (state) =>
        Object.assign({}, state, {
            isUploading: true,
        }),
});
