import axios from 'axios';
import { createBrowserHistory } from 'history';
import {RESTService} from "../api";

const history = createBrowserHistory();

export const ADD_QUESTION = 'ADD_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const SURVEY_CREATE_SUCCESS = 'SURVEY_CREATE_SUCCESS';
export const SURVEY_CREATE_FAIL = 'SURVEY_CREATE_FAIL';
export const QUESTION_CREATE_SUCCESS = 'QUESTION_CREATE_SUCCESS';
export const QUESTION_CREATE_FAIL = 'QUESTION_CREATE_FAIL';
export const SAVE_USER = 'SAVE_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001';

export function saveUser(user) {
    return {
        type: SAVE_USER,
        payload: user,
    }
}

export function logoutUser() {
    return {
        type: LOGOUT_USER,
    }
}

export function authenticateUser() {
    return dispatch => {

    }

}

export function QuestionAdded(newQuestion){
    return{
        type : ADD_QUESTION,
        payload : {
            "id" : newQuestion.id,
            "qType" : newQuestion.qType,
            "lab" : newQuestion.lab,
            "rating" : newQuestion.rating,
            "options" : newQuestion.options
        }
    }
}

export function QuestionUpdated(updatedQuestion){
    return {
        type : UPDATE_QUESTION,
        payload : {
            "id" : updatedQuestion.id,
            "qType" : updatedQuestion.qType,
            "lab" : updatedQuestion.lab,
            "rating" : updatedQuestion.rating,
            "options" : updatedQuestion.options
        }
    }
}

export function QuestionDeleted(questionID){
    return{
        type : DELETE_QUESTION,
        payload : {
            "id" : questionID,
        }
    }
}

function surveyCreateSuccess(response){
    return{
        type : SURVEY_CREATE_SUCCESS,
        payload : response.data
    }
}

function surveyCreateFailed(response){
    return{
        type : SURVEY_CREATE_FAIL,
        payload : response.data
    }
}
export function CreateSurvey(surveyDetails){
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    return (dispatch) => {
        const request = axios(`${api}/createSurvey`,{
            method: 'post',
            mode: 'no-cors',
            redirect: 'follow',
            withCredentials: true,
            headers: headers,
            data: surveyDetails
        }).then((response)=>{
            if(response.status == 200){
                dispatch(surveyCreateSuccess(response));
                history.push('/question');
            }else{
                dispatch(surveyCreateFailed(response))
            }
        })
    }    
}

function QuestionCreateSuccess(response){
    return{
        type : QUESTION_CREATE_SUCCESS,
        payload : response.data
    }
}

function QuestionCreateFailed(response){
    return{
        type : QUESTION_CREATE_FAIL,
        payload : response.data
    }
}
export function CreateQuestion(questionsArr){
    console.log("Questions Arr : ", questionsArr);
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    return (dispatch) => {
        const request = axios(`${api}/createQuestions`,{
            method: 'post',
            mode: 'no-cors',
            redirect: 'follow',
            withCredentials: true,
            headers: headers,
            data: questionsArr
        }).then((response)=>{
            if(response.status == 200){
                dispatch(surveyCreateSuccess(response));
                // history.push('/question');
            }else{
                dispatch(surveyCreateFailed(response))
            }
        })
    }    
}

