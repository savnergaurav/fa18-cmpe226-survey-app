import * as actionTypes from './actions';

const initialState = {
    question : []
}

const reducer = (state = initialState, action) => {
    console.log("Action : ", action.payload);
    switch(action.type){
        case actionTypes.ADD_QUESTION:
            return{
                ...state,
                question : state.question.concat(action.payload)
            }
            
        case actionTypes.UPDATE_QUESTION:
        let r1 = action.payload.rating;
        let r2 = parseInt(r1,10);
            let q1 = [...state.question];
            console.log("Q1 : ",q1);
            let q2 = {...q1}
            console.log("Q2 : ",q2);
            let q3 = q1.map(q => {
                if(q.id == action.payload.id){
                   return{
                        ...q,
                        options : action.payload.options,
                        lab : action.payload.lab,
                        rating : r2
                   }
                }else
                    return q;
            })
            console.log("Updated Q3 : ", q3);
            return{
                ...state,
                question : q3
            }
    
        
        case actionTypes.DELETE_QUESTION:
            let q7 = [...state.question];
            let index = -1;
            q7.map((q,i) => {
                if(q.id == action.payload.id){
                    index = i
                }
            })
            if(index > -1){
                q7.splice(index,1);
            }
            return{
                ...state,
                ...state.question,
                question : q7
            }

        }
    
    return state;
}

export default reducer;