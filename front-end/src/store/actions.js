import axios from 'axios';

export const ADD_QUESTION = 'ADD_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const SURVEY_CREATE_SUCCESS = 'SURVEY_CREATE_SUCCESS';
export const SURVEY_CREATE_FAIL = 'SURVEY_CREATE_FAIL';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:8900';



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
    console.log("Inside Create Survey Action : ", surveyDetails);
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    return (dispatch) => {
        const request = axios(`${api}/createSurvey`,{
            method: 'post',
            mode: 'no-cors',
            redirect: 'follow',
            withCredentials: true,
            headers: headers,
            data: JSON.stringify(surveyDetails)
        }).then((response)=>{
            if(response.status == 200){
                dispatch(surveyCreateSuccess(response))
            }else{
                dispatch(surveyCreateFailed(response))
            }
        })
    }
    
    // const request = axios(`${api}/createSurvey`,{
    //     method: 'post',
    //     mode: 'no-cors',
    //     redirect: 'follow',
    //     withCredentials: true,
    //     headers: headers,
    //     data: JSON.stringify(surveyDetails)
    // })
    // .then(

    // )
        
}

