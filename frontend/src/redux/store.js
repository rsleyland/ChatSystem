import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { userLoginReducer, userRegisterReducer, 
     userResetPasswordEmailReducer, userResetPasswordChangeReducer, userProfileReducer, userUpdateReducer, userUpdateProfileReducer } from './reducers/userReducer.js';
import { USER_IN_STORAGE, USER_PROFILE_IN_STORAGE } from './constants/userConstants.js';
const CLEAR_ALL_REDUCERS_DATA = 'CLEAR_ALL_REDUCERS_DATA';


const reducers = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userResetPasswordEmail: userResetPasswordEmailReducer,
    userResetPasswordChange: userResetPasswordChangeReducer,
    userProfile: userProfileReducer,
    userUpdate: userUpdateReducer,
    userUpdateProfile: userUpdateProfileReducer

});

// Initial state from local storage
const initialState = {
    userLogin: {userInfo: localStorage.getItem(USER_IN_STORAGE)? JSON.parse(localStorage.getItem(USER_IN_STORAGE)): null},
    userProfile: {profileInfo: localStorage.getItem(USER_PROFILE_IN_STORAGE)? JSON.parse(localStorage.getItem(USER_PROFILE_IN_STORAGE)): null}
};


// To clear all redux store data when user logs out else use reducers as normal
const rootReducer = (state, action) => {
    switch (action.type) {
        case  CLEAR_ALL_REDUCERS_DATA:
            return state = undefined;
        default:
            return reducers(state, action)
    }
};

// Redux store config - middleware i.e Thunk is added automatically
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState,
});

export { store, CLEAR_ALL_REDUCERS_DATA };