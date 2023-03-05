import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_IN_STORAGE,
    USER_REGISTER_REQUEST,
    USER_REGISTER_FAIL,
    USER_REGISTER_SUCCESS,
    USER_RESET_PASSWORD_EMAIL_REQUEST,
    USER_RESET_PASSWORD_EMAIL_SUCCESS,
    USER_RESET_PASSWORD_EMAIL_FAIL,
    USER_RESET_PASSWORD_CHANGE_REQUEST,
    USER_RESET_PASSWORD_CHANGE_SUCCESS,
    USER_RESET_PASSWORD_CHANGE_FAIL,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_IN_STORAGE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_FAIL,
    USER_PROFILE_UPDATE_REQUEST,
} from "../constants/userConstants";
import { CLEAR_ALL_REDUCERS_DATA } from "../store.js";
import axios from 'axios';


const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const { data } = await axios.post('/api/account/login/', { email, password });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem(USER_IN_STORAGE, JSON.stringify(data));
    } catch (error) {
        dispatch({ type: USER_LOGIN_FAIL, payload: error?.response?.data });
    }
}

const register = (email, password, first_name, last_name = '',) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });
        const { data } = await axios.post('/api/account/register/', { email, password, first_name, last_name });
        dispatch({ type: USER_REGISTER_SUCCESS });
    }
    catch (error) {
        dispatch({ type: USER_REGISTER_FAIL, payload: error?.response?.data });
    }
}

const logout = () => async (dispatch) => {
    localStorage.clear();
    try{
        await axios.post('/api/account/logout/');
    }
    catch(error){
        console.log(error);
    }
    dispatch({ type: USER_LOGOUT });
    dispatch({type: CLEAR_ALL_REDUCERS_DATA});
}

const resetPasswordEmail = (email) => async (dispatch) => {
    try {
        dispatch({ type: USER_RESET_PASSWORD_EMAIL_REQUEST });
        await axios.post('/api/account/reset-password/', { email });
        dispatch({ type: USER_RESET_PASSWORD_EMAIL_SUCCESS });
    }
    catch (error) {
        dispatch({ type: USER_RESET_PASSWORD_EMAIL_FAIL, payload: error?.response?.data });
    }
}

const resetPasswordChange = (email, code, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_RESET_PASSWORD_CHANGE_REQUEST });
        await axios.post(`/api/account/reset-password/${code}/`, { email, password });
        dispatch({ type: USER_RESET_PASSWORD_CHANGE_SUCCESS });
    }
    catch (error) {
        dispatch({ type: USER_RESET_PASSWORD_CHANGE_FAIL, payload: error?.response?.data });
    }
}

const getUserProfile = () => async (dispatch) => {
    try {
        dispatch({ type: USER_PROFILE_REQUEST });
        const { data } = await axios.get('/api/account/profile/');
        dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
        localStorage.setItem(USER_PROFILE_IN_STORAGE, JSON.stringify(data));
    } catch (error) {
        dispatch({ type: USER_PROFILE_FAIL, payload: error?.response?.data });
    }
}

const updateUser = (user) => async (dispatch) => {
    try {
        dispatch({ type: USER_UPDATE_REQUEST });
        const { data } = await axios.put('/api/account/update/', user);
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
        localStorage.setItem(USER_IN_STORAGE, JSON.stringify(data));
    } catch (error) {
        dispatch({ type: USER_UPDATE_FAIL, payload: error?.response?.data });
    }
}

const updateUserProfile = (profile) => async (dispatch) => {
    try {
        dispatch({ type: USER_PROFILE_UPDATE_REQUEST });
        const { data } = await axios.put('/api/account/update-profile/', profile);
        dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
        localStorage.setItem(USER_PROFILE_IN_STORAGE, JSON.stringify(data));
    } catch (error) {
        dispatch({ type: USER_PROFILE_UPDATE_FAIL, payload: error?.response?.data });
    }
}




export { login, register, logout, resetPasswordEmail, resetPasswordChange, getUserProfile, updateUser, updateUserProfile };