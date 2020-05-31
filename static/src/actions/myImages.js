import { FETCH_MY_IMAGE_DATA, RECEIVE_MY_IMAGE_DATA} from '../constants/index';
import { parseJSON } from '../utils/misc';
import { my_images } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receiveMyImageData(data) {
    return {
        type: RECEIVE_MY_IMAGE_DATA,
        payload: {
            data,
        },
    };
}

export function fetchMyImageDataRequest() {
    return {
        type: FETCH_MY_IMAGE_DATA,
    };
}

export function fetchMyImages(token) {
  return (dispatch) => {
      dispatch(fetchMyImageDataRequest());
      my_images(token)
          .then(parseJSON)
          .then(response => {
              dispatch(receiveMyImageData(response.result));
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
