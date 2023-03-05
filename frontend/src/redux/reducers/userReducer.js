import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_FAIL,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_CLEAR,
    USER_RESET_PASSWORD_EMAIL_REQUEST,
    USER_RESET_PASSWORD_EMAIL_SUCCESS,
    USER_RESET_PASSWORD_EMAIL_FAIL,
    USER_RESET_PASSWORD_CHANGE_SUCCESS,
    USER_RESET_PASSWORD_CHANGE_FAIL,
    USER_RESET_PASSWORD_CHANGE_REQUEST,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_CLEAR,
    USER_PROFILE_UPDATE_REQUEST,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_FAIL,
    USER_PROFILE_UPDATE_CLEAR,

} from '../constants/userConstants';

const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}

const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, success: true };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        case USER_REGISTER_CLEAR:
            return {};
        default:
            return state;
    }
}

const userResetPasswordEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_RESET_PASSWORD_EMAIL_REQUEST:
            return { loading: true };
        
        case USER_RESET_PASSWORD_EMAIL_SUCCESS:
            return { loading: false, success: true };
        
        case USER_RESET_PASSWORD_EMAIL_FAIL:
            return { loading: false, success: false, error: action.payload };
        
        default:
            return state;
    }
}

const userResetPasswordChangeReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_RESET_PASSWORD_CHANGE_REQUEST:
            return { loading: true };
        
        case USER_RESET_PASSWORD_CHANGE_SUCCESS:
            return { loading: false, success: true };

        case USER_RESET_PASSWORD_CHANGE_FAIL:
            return { loading: false, success: false, error: action.payload };
        
        default:
            return state;
    }
}

const userProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { loading: true };
        case USER_PROFILE_SUCCESS:
            return { loading: false, profileInfo: action.payload };
        case USER_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true };
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_CLEAR:
            return {};
        default:
            return state;
    }
}


const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_UPDATE_REQUEST:
            return { loading: true };
        case USER_PROFILE_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case USER_PROFILE_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_PROFILE_UPDATE_CLEAR:
            return {};
        default:
            return state;
    }
}






export { userLoginReducer, userRegisterReducer, userResetPasswordEmailReducer,
        userResetPasswordChangeReducer, userProfileReducer, userUpdateReducer,
        userUpdateProfileReducer };