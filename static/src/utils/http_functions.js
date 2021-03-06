/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password) {
    return axios.post('/api/create_user', {
        email,
        password,
    });
}

export function get_token(email, password) {
    return axios.post('/api/get_token', {
        email,
        password,
    });
}

export function has_github_token(token) {
    return axios.get('/api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('/api/user', tokenConfig(token));
}

export function my_images(token) {
    return axios.get('/api/all_images_by_user', tokenConfig(token));
}

export function public_images(token) {
    return axios.get('/api/all_public_images', tokenConfig(token));
}

export function upload_image(token, file, isPublic, categories) {
  var bodyFormData = new FormData();
    bodyFormData.set('public', isPublic);
    bodyFormData.set('categories', categories);
    bodyFormData.append('image_data', file);
    return axios({
      method: 'post',
      url: '/api/image_file',
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
       }
    });
}
