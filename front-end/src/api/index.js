import axios from 'axios';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001';


axios.defaults.withCredentials = true;

export const RESTService = {
    signup,
    dashboardCreatedByYou,
    dashboardResondedByYou,
    surveyResponseTrend,
    surveyOptionTrend,
    getUserCities,
    filteredResponseTrend,
    filteredOptionTrend
};

function signup(user) {
    let userSignUp = api + '/users/register';
    return axiosPost(userSignUp, user);
}

function dashboardCreatedByYou(user) {
    let dashboardCreatedByYou = api + '/dashboard/dashboardCreatedByYou';
    return axiosPost(dashboardCreatedByYou, user);
}

function dashboardResondedByYou(user) {
    let dashboardResondedByYou = api + '/dashboard/dashboardResondedByYou';
    return axiosPost(dashboardResondedByYou, user);
}

function surveyResponseTrend(survey) {
    let surveyResponseTrend = api + '/dashboard/surveyResponseTrend';
    return axiosPost(surveyResponseTrend, survey);
}

function filteredResponseTrend(survey) {
    let filteredResponseTrend = api + '/dashboard/filteredResponseTrend';
    return axiosPost(filteredResponseTrend, survey);
}

function surveyOptionTrend(survey) {
    let surveyOptionTrend = api + '/dashboard/surveyOptionTrend';
    return axiosPost(surveyOptionTrend, survey);
}

function filteredOptionTrend(survey) {
    let filteredOptionTrend = api + '/dashboard/filteredOptionTrend';
    return axiosPost(filteredOptionTrend, survey);
}

function getUserCities() {
    let getUserCities = api+"/dashboard/getUserCities";
    return axios.get(getUserCities)
        .then(handleSuccess)
        .catch(handleError);
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