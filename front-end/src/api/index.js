import axios from 'axios';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3000';


axios.defaults.withCredentials = true;

export const RESTService = {
    signup,
};

function signup(user) {
    let userSignUp = api + '/users/register';
    return axiosPost(userSignUp, user);
}

function axiosPost(url, data) {
    return axios.post(url, data)
        .then(handleSuccess)
        .catch(handleError);
}

function handleSuccess(response) {
    return response;
}

function handleError(error) {
    if (error.response) {
        return Promise.reject(error.response);
    }
}