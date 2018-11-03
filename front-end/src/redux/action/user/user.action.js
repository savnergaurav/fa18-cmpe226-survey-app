import {userConstants} from "../../constants/index";
import {RESTService} from "../../../api/index";
import {alertActions} from "../alert/alert.action";
import {history} from '../../../helper/history.js';

export const userActions = {
    signup,
};

function signup(user) {
    return (dispatch) => {

        RESTService.signup(user)
            .then(
                user => {
                    //dispatch(success());
                    dispatch(alertActions.success(user.data));
                    history.push('/signin');

                },
                error => {
                    console.log(error);
                    dispatch(failure(error));
                    dispatch(alertActions.error(error.data));

                }
            );
    };

    function failure(error) {
        return {type: userConstants.REGISTER_FAILURE, error}
    }
}