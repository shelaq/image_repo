import { UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_RESPONSE } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { upload_image } from '../utils/http_functions';

export function uploadImageResponse(data) {
    return {
        type: UPLOAD_IMAGE_RESPONSE,
        payload: {
            data,
        },
    };
}

export function uploadImageRequest() {
    return {
        type: UPLOAD_IMAGE_REQUEST,
    };
}

export function uploadImage(token, file, isPublic, categories) {
  return (dispatch) => {
      dispatch(uploadImageRequest());
      upload_image(token, file, isPublic, categories)
          .then(parseJSON)
          .then(response => {
              dispatch(uploadImageResponse(response.result));
          })
          .catch(error => {
              if (error.status === 401) {
                  dispatch(logoutAndRedirect(error));
              } else {
                console.log(error);
              }
          });
  };
}
