import { FETCH_MY_IMAGE_DATA, RECEIVE_MY_IMAGE_DATA, FETCH_PUBLIC_IMAGE_DATA, RECEIVE_PUBLIC_IMAGE_DATA } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { public_images } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receivePublicImageData(data) {
    return {
        type: RECEIVE_PUBLIC_IMAGE_DATA,
        payload: {
            data,
        },
    };
}

export function fetchPublicImageDataRequest() {
    return {
        type: FETCH_PUBLIC_IMAGE_DATA,
    };
}


export function fetchPublicImages(token) {
  return (dispatch) => {
      dispatch(fetchPublicImageDataRequest());
      public_images(token)
          .then(parseJSON)
          .then(response => {
              dispatch(receivePublicImageData(response.result));
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
